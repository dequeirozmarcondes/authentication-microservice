//src/controllers/UserController.ts

import { Request, Response } from "express";
import UserService from "../../application/services/UserService.js";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/UserDTO.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../schemas/userValidation.js";

class UserController {
  async create(req: Request, res: Response): Promise<void> {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const userData: CreateUserDTO = req.body;
    const user = await UserService.create(userData);
    res.status(201).json(user);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await UserService.getById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { id } = req.params;
    const userData: UpdateUserDTO = req.body;
    const user = await UserService.update(id, userData);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await UserService.delete(id);
    res.status(204).send();
  }
}

export default new UserController();
