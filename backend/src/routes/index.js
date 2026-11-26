import { Router } from 'express';
import authRoutes from './authRoutes.js';
import issueRoutes from './issueRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import helpRoutes from './helpRoutes.js';
import adminRoutes from './adminRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/issues', issueRoutes);
router.use('/notifications', notificationRoutes);
router.use('/help', helpRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'NammaFix Civic Backend',
  });
});

export default router;
