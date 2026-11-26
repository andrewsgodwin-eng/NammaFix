import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = Router();

// Secure all admin routes with auth and admin role check
router.use(authMiddleware);
router.use(adminOnly);

router.get('/issues', adminController.getIssues);
router.patch('/issues/:id/verify', adminController.verifyIssue);
router.patch('/issues/:id/reject', adminController.rejectIssue);
router.patch('/issues/:id/assign', adminController.assignDepartment);
router.patch('/issues/:id/status', adminController.updateStatus);
router.post('/issues/:id/merge', adminController.mergeDuplicates);

router.get('/stats', adminController.getStats);
router.get('/analytics', adminController.getAnalytics);

router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);

router.get('/help-messages', adminController.getHelpMessages);

export default router;
