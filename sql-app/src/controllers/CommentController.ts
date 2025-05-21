import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';

import Post from '../models/Post';
  
import User from '../models/User';
  


export const CommentController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Comment.findAll({
        
        include: [
          
          { model: require('../models/Post').default },
          
          { model: require('../models/User').default },
          
        ]
        
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return ;
      }
      const data = await Comment.findByPk(id, {
        
        include: [
          
          { model: require('../models/Post').default },
          
          { model: require('../models/User').default },
          
        ]
        
      });
      if (!data) {
            res.status(404).json({ message: 'Comment not found' })
            return ;
      }
      res.json({ 
            status: 'success', 
            data: { comment: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, postId, userId } = req.body;
      
      if (!content) {
            res.status(400).json({ message: 'content is required' });
            return
      }
      

      
      
      const post = await Post.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      

      const newData = await Comment.create({ content, postId, userId });
      res.status(201).json({ 
            status: 'success', 
            data: { comment: newData } });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      if (!id) {
            res.status(400).json({ message: 'ID is required' });
            return ;
      } 

      const { content, postId, userId } = req.body;
      
      if (!content) {
            res.status(400).json({ message: 'content is required' });
            return ;
      }
            
      
      
      const data = await Comment.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Comment not found' });
            return ;
      }

      
      
      const post = await Post.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      await data.update({ content, postId, userId });
      
      res.json({ 
            status: 'success', 
            data: { comment: data } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id){
            res.status(400).json({ message: 'ID is required' });
            return ;
      } 

      const data = await Comment.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Comment not found' });
            return ;
      }
     
      await Comment.destroy({ where: { id } });

      res.status(204).json({ 
            status: 'success', 
            message: 'Comment deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};