import { Router } from 'express';
import { helpController } from '../controllers/helpController.js';

const router = Router();

router.get('/contacts', helpController.getContacts);
router.post('/messages', helpController.submitMessage);

export default router;
