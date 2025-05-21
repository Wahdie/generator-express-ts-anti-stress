import { Request, Response, NextFunction } from 'express';
import PostTags from '../models/PostTags';

import Post from '../models/Post';
  
import Tag from '../models/Tag';
  


export const PostTagsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await PostTags.findAll({
        
        include: [
          
          { model: require('../models/Post').default },
          
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
      const data = await PostTags.findByPk(id, {
        
        include: [
          
          { model: require('../models/Post').default },
          
          { model: require('../models/Tag').default },
          
        ]
        
      });
      if (!data) {
            res.status(404).json({ message: 'PostTags not found' })
            return ;
      }
      res.json({ 
            status: 'success', 
            data: { postTags: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId, tagId } = req.body;
      

      
      
      const post = await Post.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
      
      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      

      const newData = await PostTags.create({ postId, tagId });
      res.status(201).json({ 
            status: 'success', 
            data: { postTags: newData } });
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

      const { postId, tagId } = req.body;
      
      
      const data = await PostTags.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'PostTags not found' });
            return ;
      }

      
      
      const post = await Post.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
      
      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json({ message: 'Tag not found' });
        return;
      }
      
      await data.update({ postId, tagId });
      
      res.json({ 
            status: 'success', 
            data: { postTags: data } });
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

      const data = await PostTags.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'PostTags not found' });
            return ;
      }
     
      await PostTags.destroy({ where: { id } });

      res.status(204).json({ 
            status: 'success', 
            message: 'PostTags deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};