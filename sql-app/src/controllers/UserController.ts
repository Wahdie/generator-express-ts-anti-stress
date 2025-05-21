import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

import Post from '../models/Post';
  
import Comment from '../models/Comment';
  
import Profile from '../models/Profile';
  


export const UserController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await User.findAll({
        
        include: [
          
          { model: require('../models/Post').default },
          
          { model: require('../models/Comment').default },
          
          { model: require('../models/Profile').default },
          
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
      const data = await User.findByPk(id, {
        
        include: [
          
          { model: require('../models/Post').default },
          
          { model: require('../models/Comment').default },
          
          { model: require('../models/Profile').default },
          
        ]
        
      });
      if (!data) {
            res.status(404).json({ message: 'User not found' })
            return ;
      }
      res.json({ 
            status: 'success', 
            data: { user: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role, isActive } = req.body;
      
      if (!name) {
            res.status(400).json({ message: 'name is required' });
            return
      }
      
      if (!email) {
            res.status(400).json({ message: 'email is required' });
            return
      }
      
      if (!password) {
            res.status(400).json({ message: 'password is required' });
            return
      }
      

      
      const existingData = await User.findOne({ where: { email: email } });
      
      if (existingData) {
            res.status(409).json({ 
                  message: 'email already exists' 
            });
            return
      }
      
      

      const newData = await User.create({ name, email, password, role, isActive });
      res.status(201).json({ 
            status: 'success', 
            data: { user: newData } });
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

      const { name, email, password, role, isActive } = req.body;
      
      if (!name) {
            res.status(400).json({ message: 'name is required' });
            return ;
      }
            
      
      if (!email) {
            res.status(400).json({ message: 'email is required' });
            return ;
      }
            
      
      if (!password) {
            res.status(400).json({ message: 'password is required' });
            return ;
      }
            
      
      
      const data = await User.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'User not found' });
            return ;
      }

      
      const existingData = await User.findOne({ where: { email: email } });
      if (existingData && existingData.id !== Number(id)) {
            res.status(409).json({ 
                  message: 'email already exists' 
            });
            return ;
      }
      
      
      await data.update({ name, email, password, role, isActive });
      
      res.json({ 
            status: 'success', 
            data: { user: data } });
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

      const data = await User.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'User not found' });
            return ;
      }
     
      await User.destroy({ where: { id } });

      res.status(204).json({ 
            status: 'success', 
            message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};