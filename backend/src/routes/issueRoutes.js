import { Router } from 'express';
import { issueController } from '../controllers/issueController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateIssueCreation } from '../middleware/validate.js';

const router = Router();

// Public / Semi-public queries
router.get('/nearby', issueController.getNearby);
router.get('/similar', issueController.getSimilarIssues);
router.get('/mine', authMiddleware, issueController.getMine);
router.get('/confirmed', authMiddleware, issueController.getConfirmed);
router.get('/:id', issueController.getIssueById);

// Protected citizen actions
router.post('/', authMiddleware, validateIssueCreation, issueController.createIssue);
router.post('/:id/confirm', authMiddleware, issueController.confirmIssue);
router.post('/:id/feedback', authMiddleware, issueController.submitFeedback);

export default router;
