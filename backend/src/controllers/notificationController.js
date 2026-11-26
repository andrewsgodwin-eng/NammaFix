import { Notification } from '../models/Notification.js';

export const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const notifs = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
      res.status(200).json(notifs);
    } catch (err) {
      next(err);
    }
  },

  async markRead(req, res, next) {
    try {
      await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { read: true }
      );
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async markAllRead(req, res, next) {
    try {
      await Notification.updateMany({ user: req.user._id }, { read: true });
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
