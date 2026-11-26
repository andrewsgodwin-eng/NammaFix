import { Issue } from '../models/Issue.js';
import { Confirmation } from '../models/Confirmation.js';
import { generateComplaintId } from '../services/idGenerator.js';
import { notificationService } from '../services/notificationService.js';

export const issueController = {
  // POST /api/issues
  async createIssue(req, res, next) {
    try {
      const { category, description, imageUrl, location, address } = req.body;
      const complaintId = await generateComplaintId();

      const newIssue = await Issue.create({
        complaintId,
        reporter: req.user._id,
        category,
        description,
        imageUrl: imageUrl || '',
        location: {
          type: 'Point',
          coordinates: [Number(location.lng), Number(location.lat)],
        },
        address: address || 'Chennai, Tamil Nadu',
        status: 'reported',
        affectedCount: 1,
        timeline: [
          {
            status: 'reported',
            at: new Date(),
            by: req.user.name || 'Citizen',
            note: 'Complaint registered via NammaFix app',
          },
        ],
      });

      // Auto-confirm for original reporter
      await Confirmation.create({
        issue: newIssue._id,
        user: req.user._id,
      });

      const populated = await Issue.findById(newIssue._id).populate('reporter', 'name email avatar');
      res.status(201).json({ success: true, issue: populated, complaintId });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/issues/mine
  async getMine(req, res, next) {
    try {
      const issues = await Issue.find({ reporter: req.user._id })
        .populate('department', 'name area')
        .sort({ createdAt: -1 });
      res.status(200).json(issues);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/issues/confirmed
  async getConfirmed(req, res, next) {
    try {
      const confirmations = await Confirmation.find({ user: req.user._id });
      const issueIds = confirmations.map((c) => c.issue);
      const issues = await Issue.find({
        _id: { $in: issueIds },
        reporter: { $ne: req.user._id },
      })
        .populate('department', 'name area')
        .sort({ createdAt: -1 });
      res.status(200).json(issues);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/issues/nearby?lat=&lng=&radius=&category=&status=
  async getNearby(req, res, next) {
    try {
      const lat = parseFloat(req.query.lat) || 13.0418;
      const lng = parseFloat(req.query.lng) || 80.2337;
      const radiusKm = parseFloat(req.query.radius) || 10;
      const category = req.query.category;
      const status = req.query.status;

      const query = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: radiusKm * 1000, // in meters
          },
        },
      };

      if (category && category !== 'all') {
        query.category = category;
      }
      if (status && status !== 'all') {
        if (status === 'open') {
          query.status = { $nin: ['resolved', 'rejected'] };
        } else {
          query.status = status;
        }
      }

      const issues = await Issue.find(query)
        .populate('reporter', 'name email avatar')
        .populate('department', 'name area')
        .limit(100);

      res.status(200).json(issues);
    } catch (err) {
      // Fallback query if 2dsphere index is warming up
      const fallbackQuery = {};
      if (req.query.category && req.query.category !== 'all') fallbackQuery.category = req.query.category;
      const issues = await Issue.find(fallbackQuery).populate('department').limit(50);
      res.status(200).json(issues);
    }
  },

  // GET /api/issues/:idOrComplaintId
  async getIssueById(req, res, next) {
    try {
      const param = req.params.id;
      let issue = null;

      if (param.startsWith('NMF-')) {
        issue = await Issue.findOne({ complaintId: param })
          .populate('reporter', 'name email phone avatar')
          .populate('department', 'name area contactPhone contactEmail');
      } else {
        issue = await Issue.findById(param)
          .populate('reporter', 'name email phone avatar')
          .populate('department', 'name area contactPhone contactEmail');
      }

      if (!issue) {
        return res.status(404).json({ success: false, message: 'Issue not found' });
      }

      // Check if current user has confirmed this issue
      let isConfirmed = false;
      if (req.user) {
        const conf = await Confirmation.findOne({ issue: issue._id, user: req.user._id });
        isConfirmed = !!conf;
      }

      res.status(200).json({ ...issue.toObject(), isConfirmedByUser: isConfirmed });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/issues/:id/confirm
  async confirmIssue(req, res, next) {
    try {
      const issueId = req.params.id;
      const issue = issueId.startsWith('NMF-')
        ? await Issue.findOne({ complaintId: issueId })
        : await Issue.findById(issueId);

      if (!issue) {
        return res.status(404).json({ success: false, message: 'Issue not found' });
      }

      // Atomic confirmation upsert
      const existing = await Confirmation.findOne({
        issue: issue._id,
        user: req.user._id,
      });

      if (!existing) {
        await Confirmation.create({
          issue: issue._id,
          user: req.user._id,
        });

        issue.affectedCount = (issue.affectedCount || 1) + 1;
        await issue.save();

        await notificationService.notifyConfirmationAdded(issue, issue.affectedCount);
      }

      res.status(200).json({
        success: true,
        affectedCount: issue.affectedCount,
        issue,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/issues/:id/feedback
  async submitFeedback(req, res, next) {
    try {
      const { isFixed } = req.body;
      const issueId = req.params.id;
      const issue = issueId.startsWith('NMF-')
        ? await Issue.findOne({ complaintId: issueId })
        : await Issue.findById(issueId);

      if (!issue) {
        return res.status(404).json({ success: false, message: 'Issue not found' });
      }

      if (!isFixed) {
        issue.status = 'reopened';
        issue.timeline.push({
          status: 'reopened',
          at: new Date(),
          by: `${req.user.name} (Citizen Feedback)`,
          note: 'Citizen verified on site: Defect is still present.',
        });
        await issue.save();
        await notificationService.notifyStatusChange(issue, 'reopened');
      }

      res.status(200).json({ success: true, issue });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/issues/similar?lat=&lng=&category=
  async getSimilarIssues(req, res, next) {
    try {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const category = req.query.category;

      if (!lat || !lng || !category) {
        return res.status(200).json([]);
      }

      const similar = await Issue.find({
        category,
        status: { $nin: ['resolved', 'rejected'] },
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: 150, // within 150 meters
          },
        },
      }).limit(3);

      res.status(200).json(similar);
    } catch (err) {
      res.status(200).json([]);
    }
  },
};
