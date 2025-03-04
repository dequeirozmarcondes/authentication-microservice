import { Request, Response } from 'express';
import { UserService } from '@/application/services/UserService.js';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/UserDTO.js';
import logger from '@/infrastructure/logging/logger.js';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      const newUser = await this.userService.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      logger.error(`Failed to create user: ${error}`);
      res.status(500).json({ message: 'Failed to create user' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      logger.error(`Failed to find user by ID: ${error}`);
      res.status(500).json({ message: 'Failed to find user by ID' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const userData: UpdateUserDTO = req.body;
      const updatedUser = await this.userService.update(userId, userData);

      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      logger.error(`Failed to update user: ${error}`);
      res.status(500).json({ message: 'Failed to update user' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      await this.userService.delete(userId);
      res.status(204).send(); // 204 No Content
    } catch (error) {
      logger.error(`Failed to delete user: ${error}`);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  }
}
