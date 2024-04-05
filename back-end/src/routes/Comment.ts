import express from 'express';
import CommentController from '../controllers/CommentController';
import authentification from '../middleware/Authentication';

const router = express.Router();

router.post('/create', authentification, CommentController.createComment);

export default router;
