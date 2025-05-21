import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import User from '../models/User';

export const UserController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await User.find();
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

      const data = await User.findById(id).populate('userId');
      if (!data) {
        res.status(404).json({ message: 'User not found' });
        return;

      }

      res.json({
        status: 'success',
        data: { User: data },
      });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      if (!name) {
        res.status(400).json({ message: 'name is required' });
        return;
      }

      if (!password) {
        res.status(400).json({ message: 'password is required' });
        return;
      }

      if (!email) {
        res.status(400).json({ message: 'email is required' });
        return;
      }

      const newUser = new User({ name, email, password });
      const savedUser = await newUser.save();

      res.status(201).json({
        status: 'success',
        data: { User: savedUser },
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

      const { name, email, password } = req.body;

      if (!name) {
        res.status(400).json({ message: 'name is required' });
        return;

      }

      if (!email){
        res.status(400).json({ message: 'email is required' });
        return;
      }
        

      
      

      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      user.name = name;
      user.email = email;
      user.password = password;

      const updatedUser = await user.save();

      res.json({
        status: 'success',
        data: { user: updatedUser },
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

      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      await user.deleteOne();

      res.status(204).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
  
};
