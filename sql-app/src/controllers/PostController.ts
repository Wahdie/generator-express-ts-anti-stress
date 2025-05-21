import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';

import User from '../models/User';
  
import Comment from '../models/Comment';
  
import Tag from '../models/Tag';
  


export const PostController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Post.findAll({
        
        include: [
          
          { model: require('../models/User').default },
          
          { model: require('../models/Comment').default },
          
          { model: require('../models/Tag').default },
          
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
      const data = await Post.findByPk(id, {
        
        include: [
          
          { model: require('../models/User').default },
          
          { model: require('../models/Comment').default },
          
          { model: require('../models/Tag').default },
          
        ]
        
      });
      if (!data) {
            res.status(404).json({ message: 'Post not found' })
            return ;
      }
      res.json({ 
            status: 'success', 
            data: { post: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, photo, publishedAt, userId } = req.body;
      
      if (!title) {
            res.status(400).json({ message: 'title is required' });
            return
      }
      
      if (!content) {
            res.status(400).json({ message: 'content is required' });
            return
      }
      

      
      
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      

      const newData = await Post.create({ title, content, photo, publishedAt, userId });
      res.status(201).json({ 
            status: 'success', 
            data: { post: newData } });
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

      const { title, content, photo, publishedAt, userId } = req.body;
      
      if (!title) {
            res.status(400).json({ message: 'title is required' });
            return ;
      }
            
      
      if (!content) {
            res.status(400).json({ message: 'content is required' });
            return ;
      }
            
      
      
      const data = await Post.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Post not found' });
            return ;
      }

      
      
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      await data.update({ title, content, photo, publishedAt, userId });
      
      res.json({ 
            status: 'success', 
            data: { post: data } });
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

      const data = await Post.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Post not found' });
            return ;
      }
     
      await Post.destroy({ where: { id } });

      res.status(204).json({ 
            status: 'success', 
            message: 'Post deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};