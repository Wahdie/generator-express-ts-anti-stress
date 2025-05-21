import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import User from '../models/User';

export const PostController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Post.find().populate([
        {path : 'user', model: 'User', select: 'name email' }
      ]);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;

      }

      const data = await Post.findById(id).populate('userId');
      if (!data) {
        res.status(404).json({ message: 'Post not found' });
        return;

      }

      res.json({
        status: 'success',
        data: { post: data },
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, photo, userId } = req.body;

      if (!title) {
        res.status(400).json({ message: 'title is required' });
        return;
      }

      if (!content) {
        res.status(400).json({ message: 'content is required' });
        return;
      }

      if (userId) {
       const user = await User.findById(userId);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;

        }
      }
      

      const newPost = new Post({ title, content, photo, userId });
      const savedPost = await newPost.save();

      res.status(201).json({
        status: 'success',
        data: { post: savedPost },
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;

      }

      const { title, content, photo, userId } = req.body;

      if (!title) {
        res.status(400).json({ message: 'title is required' });
        return;

      }

      if (!content) {
        res.status(400).json({ message: 'content is required' });
        return;

      }

      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;

      }

      if (userId) {
        const user = await User.findById(userId);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;

        }
      }

      post.title = title;
      post.content = content;
      post.photo = photo;
      post.userId = userId;

      const updatedPost = await post.save();

      res.json({
        status: 'success',
        data: { post: updatedPost },
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;

      }

      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;

      }

      await post.deleteOne();

      res.status(204).json({
        status: 'success',
        message: 'Post deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
};
