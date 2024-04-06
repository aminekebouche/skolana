import { NextFunction, Request, Response } from 'express';
import Post, { IPost } from '../models/Post';
import { PDFDocument } from 'pdf-lib';

var fs = require('fs');
var multer = require('multer');

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content, type, price } = req.body;
        console.log(req.body);
        const author = req.user;
        const documents: String[] = [];

        if (type === 'Document') {
            uploadDocument(req, res, next);
            const filename = req.file!.filename;
            documents.push(filename);
        }

        const post = await Post.create({ content, author, type, documents, price });
        res.status(200).json({ Message: 'File uploaded' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the PDF file.' });
        console.log(error);
    }
};

const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content, type } = req.body;
        console.log('content');
        console.log(type);
        const uploadedFile = req.file;
        console.log(uploadedFile);
        if (!uploadedFile) {
            throw new Error('No file uploaded');
        }
        const pdfPath = uploadedFile.path; // Path to the uploaded PDF file
        const pdfBytes = await fs.readFile(pdfPath, async (err: any, data: any) => {
            if (err) throw err;
            const pdfDoc = await PDFDocument.load(data);
            const user: any = req.user;
            pdfDoc.setAuthor(user.id);
            const modifiedPdfBytes = await pdfDoc.save();
            await fs.writeFile(uploadedFile.path, modifiedPdfBytes, (err: any) => {
                if (err) console.log(err);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const postId = req.body.postId;

        let post: IPost | null = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "La publication n'existe pas" });
        }

        console.log('author : ', post.author.toString());
        console.log('user : ', user.id);

        if (post.author.toString() !== user.id) {
            throw new Error("Echec de supression de Post Le post n'appartient pas à l'utilisateur !");
        }
        post.delete();
        return res.status(200).json({ message: 'Post supprimé avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Une erreur est survenue lors du traitement de la requête' });
    }
};

const likeOrUnlikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const postId = req.body.postId;
        console.log(req.body);

        let post: IPost | null = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "La publication n'existe pas" });
        }

        const userIndex = post.likes.findIndex((like: any) => like.toString() === user.id.toString());

        if (userIndex === -1) {
            post.likes.push(user._id);
        } else {
            post.likes.splice(userIndex, 1);
        }

        post = await post.save();
        return res.status(200).json({ post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Une erreur est survenue lors du traitement de la requête' });
    }
};

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find();
        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(400).json(error);
    }
};

const savePost = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
};

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        const user: any = req.user;

        var dir = 'uploads/' + user.id;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir + '/');
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default { createPost, deletePost, likeOrUnlikePost, savePost, getAllPosts, upload, uploadDocument };
