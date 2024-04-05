import express from 'express';
import ctrlUser from '../controllers/Post';
import authentification from '../middleware/Authentication';

const router = express.Router();

router.post('/create', authentification, ctrlUser.upload.single('file'), ctrlUser.createPost);

router.post('/remove', authentification, ctrlUser.deletePost);
router.post('/likeOrUnlike', authentification, ctrlUser.likeOrUnlikePost);
router.get('/posts', authentification, ctrlUser.getAllPosts);

export default router;
