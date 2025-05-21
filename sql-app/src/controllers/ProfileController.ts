import { Request, Response, NextFunction } from 'express';
import Profile from '../models/Profile';

import User from '../models/User';
  


export const ProfileController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Profile.findAll({
        
        include: [
          
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
      const data = await Profile.findByPk(id, {
        
        include: [
          
          { model: require('../models/User').default },
          
        ]
        
      });
      if (!data) {
            res.status(404).json({ message: 'Profile not found' })
            return ;
      }
      res.json({ 
            status: 'success', 
            data: { profile: data } 
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bio, website, userId } = req.body;
      

      
      
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      

      const newData = await Profile.create({ bio, website, userId });
      res.status(201).json({ 
            status: 'success', 
            data: { profile: newData } });
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

      const { bio, website, userId } = req.body;
      
      
      const data = await Profile.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Profile not found' });
            return ;
      }

      
      
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      await data.update({ bio, website, userId });
      
      res.json({ 
            status: 'success', 
            data: { profile: data } });
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

      const data = await Profile.findByPk(id);
      if (!data) {
            res.status(404).json({ message: 'Profile not found' });
            return ;
      }
     
      await Profile.destroy({ where: { id } });

      res.status(204).json({ 
            status: 'success', 
            message: 'Profile deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};