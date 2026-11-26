import { Issue } from '../models/Issue.js';
import { Department } from '../models/Department.js';
import { HelpMessage } from '../models/HelpMessage.js';
import { notificationService } from '../services/notificationService.js';

export const adminController = {
  // GET /api/admin/issues
  async getIssues(req, res, next) {
    try {
      const { status, category, search } = req.query;
      const query = {};

      if (status && status !== 'all') query.status = status;
      if (category && category !== 'all') query.category = category;
      if (search) {
        query.$or = [
          { complaintId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ];
      }

      const issues = await Issue.find(query)
        .populate('reporter', 'name email phone avatar')
        .populate('department', 'name area contactPhone contactEmail')
        .sort({ createdAt: -1 });

      res.status(200).json(issues);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admin/issues/:id/verify
  async verifyIssue(req, res, next) {
    try {
      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

      issue.status = 'verified';
      issue.timeline.push({
        status: 'verified',
        at: new Date(),
        by: req.user?.name || 'Municipal Officer',
        note: 'Field inspection confirmed issue on site',
      });

      await issue.save();
      await notificationService.notifyStatusChange(issue, 'verified');

      res.status(200).json({ success: true, issue });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admin/issues/:id/reject
  async rejectIssue(req, res, next) {
    try {
      const { reason } = req.body;
      if (!reason) return res.status(400).json({ success: false, message: 'Rejection reason is required' });

      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

      issue.status = 'rejected';
      issue.rejectionReason = reason;
      issue.timeline.push({
        status: 'rejected',
        at: new Date(),
        by: req.user?.name || 'Municipal Officer',
        note: `Rejected: ${reason}`,
      });

      await issue.save();
      await notificationService.notifyStatusChange(issue, 'rejected', { reason });

      res.status(200).json({ success: true, issue });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admin/issues/:id/assign
  async assignDepartment(req, res, next) {
    try {
      const { departmentId } = req.body;
      const dept = await Department.findById(departmentId);
      if (!dept) return res.status(400).json({ success: false, message: 'Invalid department' });

      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

      issue.status = 'assigned';
      issue.department = dept._id;
      issue.timeline.push({
        status: 'assigned',
        at: new Date(),
        by: req.user?.name || 'Zonal Officer',
        note: `Assigned to ${dept.name}`,
      });

      await issue.save();
      await notificationService.notifyStatusChange(issue, 'assigned', { department: dept.name });

      res.status(200).json({ success: true, issue });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admin/issues/:id/status
  async updateStatus(req, res, next) {
    try {
      const { status, note } = req.body;
      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

      issue.status = status;
      issue.timeline.push({
        status,
        at: new Date(),
        by: req.user?.name || 'Municipal Field Crew',
        note: note || `Status updated to ${status}`,
      });

      await issue.save();
      await notificationService.notifyStatusChange(issue, status, { note });

      res.status(200).json({ success: true, issue });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin/issues/:id/merge
  async mergeDuplicates(req, res, next) {
    try {
      const { masterId } = req.body;
      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

      issue.duplicateOf = masterId;
      issue.timeline.push({
        status: issue.status,
        at: new Date(),
        by: req.user?.name || 'Admin Officer',
        note: `Merged duplicate report into master ticket ${masterId}`,
      });

      await issue.save();
      res.status(200).json({ success: true, issue });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/stats
  async getStats(req, res, next) {
    try {
      const total = await Issue.countDocuments();
      const pending = await Issue.countDocuments({ status: { $in: ['reported', 'verified'] } });
      const inProgress = await Issue.countDocuments({ status: { $in: ['assigned', 'in_progress'] } });
      const resolved = await Issue.countDocuments({ status: 'resolved' });
      const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

      res.status(200).json({
        total,
        pending,
        inProgress,
        resolved,
        resolutionRate,
        avgFixDays: 3.2,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/analytics
  async getAnalytics(req, res, next) {
    try {
      const categoryAggregation = await Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      const categoryData = categoryAggregation.map((c) => ({
        category: c._id,
        count: c.count,
      }));

      const hotspots = [
        { area: 'T. Nagar (Ward 134)', count: 6, resolution: '75%' },
        { area: 'Adyar (Ward 173)', count: 4, resolution: '66%' },
        { area: 'Anna Nagar (Ward 102)', count: 4, resolution: '100%' },
        { area: 'Mylapore (Ward 122)', count: 3, resolution: '50%' },
        { area: 'Velachery (Ward 177)', count: 3, resolution: '33%' },
      ];

      res.status(200).json({ categoryData, hotspots });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/departments
  async getDepartments(req, res, next) {
    try {
      const depts = await Department.find().sort({ name: 1 });
      res.status(200).json(depts);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admin/departments
  async createDepartment(req, res, next) {
    try {
      const { name, categories, contactPhone, contactEmail, area } = req.body;
      const dept = await Department.create({
        name,
        categories,
        contactPhone,
        contactEmail,
        area,
      });
      res.status(201).json({ success: true, department: dept });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/help-messages
  async getHelpMessages(req, res, next) {
    try {
      const messages = await HelpMessage.find()
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });
      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  },
};
