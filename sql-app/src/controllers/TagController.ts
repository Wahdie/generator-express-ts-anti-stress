import { Request, Response, NextFunction } from 'express';
import Tag from '../models/Tag';

import Post from '../models/Post';
  


export const TagController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Tag.findAll({
        
        include: [
          
          { model: require('../models/Post').default },
          
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
      const data = await Tag.findByPk(id, {
        
        include: [
          
          { model: require('../models/Post').default },
          
        ]
        
      });
      if (!data) {
            res.status(404).json({ message: 'Tag not found' })
            return ;
      }
      res.json({ 
            status: 'success', 
            data: { tag: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      
      if (!name) {
            res.status(400).json({ message: 'name is required' });
            return
      }
      

      
      const existingData = await Tag.findOne({ where: { name: name } });
      
      if (existingData) {
            res.status(409).json({ 
                  message: 'name already exists' 
            });
            return
      }
      
      

      const newData = await Tag.create({ name });
      res.status(201).json({ 
            status: 'success', 
            data: { tag: newData } });
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

      const { name } = req.body;
      
      if (!name) {
            res.status(400).json({ message: 'name is required' });
            return ;
      }
            
      
      
      const data = await Tag.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Tag not found' });
            return ;
      }

      
      const existingData = await Tag.findOne({ where: { name: name } });
      if (existingData && existingData.id !== Number(id)) {
            res.status(409).json({ 
                  message: 'name already exists' 
            });
            return ;
      }
      
      
      await data.update({ name });
      
      res.json({ 
            status: 'success', 
            data: { tag: data } });
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

      const data = await Tag.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Tag not found' });
            return ;
      }
     
      await Tag.destroy({ where: { id } });

      res.status(204).json({ 
            status: 'success', 
            message: 'Tag deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};