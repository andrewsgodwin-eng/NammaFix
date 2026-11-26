import { Department } from '../models/Department.js';
import { HelpMessage } from '../models/HelpMessage.js';

export const helpController = {
  async getContacts(req, res, next) {
    try {
      const departments = await Department.find().sort({ name: 1 });
      res.status(200).json({ success: true, departments });
    } catch (err) {
      next(err);
    }
  },

  async submitMessage(req, res, next) {
    try {
      const { subject, message } = req.body;
      const helpMsg = await HelpMessage.create({
        user: req.user?._id || null,
        subject,
        message,
        status: 'new',
      });
      res.status(201).json({
        success: true,
        message: 'Your support inquiry has been logged with city operations.',
        ticket: helpMsg,
      });
    } catch (err) {
      next(err);
    }
  },
};
