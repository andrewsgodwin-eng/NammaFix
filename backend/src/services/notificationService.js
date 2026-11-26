import { Notification } from '../models/Notification.js';
import { Confirmation } from '../models/Confirmation.js';

export const notificationService = {
  async notifyStatusChange(issue, newStatus, extraParams = {}) {
    try {
      const recipientUserIds = new Set();
      if (issue.reporter) {
        recipientUserIds.add(issue.reporter.toString());
      }

      // Also notify confirmed users
      const confirmations = await Confirmation.find({ issue: issue._id });
      confirmations.forEach((c) => recipientUserIds.add(c.user.toString()));

      let notifType = 'type_status_update';
      if (newStatus === 'verified') notifType = 'type_verified';
      if (newStatus === 'assigned') notifType = 'type_assigned';
      if (newStatus === 'resolved') notifType = 'type_resolved';
      if (newStatus === 'rejected') notifType = 'type_rejected';

      const notifications = Array.from(recipientUserIds).map((userId) => ({
        user: userId,
        issue: issue._id,
        type: notifType,
        params: {
          issueId: issue.complaintId,
          status: newStatus,
          ...extraParams,
        },
        read: false,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (err) {
      console.warn('⚠️ Notification creation error:', err.message);
    }
  },

  async notifyConfirmationAdded(issue, confirmedCount) {
    try {
      if (!issue.reporter) return;
      await Notification.create({
        user: issue.reporter,
        issue: issue._id,
        type: 'type_confirmation_added',
        params: {
          issueId: issue.complaintId,
          count: confirmedCount,
        },
        read: false,
      });
    } catch (err) {
      console.warn('⚠️ Notification creation error:', err.message);
    }
  },
};
