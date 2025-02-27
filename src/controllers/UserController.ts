import { Request, Response } from 'express';
import Joi from 'joi';
import UserService from '../services/UserService';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/UserDTO';

// Esquemas de validação
const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
});

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

    async login(req: Request, res: Response): Promise<void> {
        const { error } = loginUserSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { email, password } = req.body;
        const token = await UserService.login(email, password);

        if (!token) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        res.json({ token });
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const user = await UserService.getById(id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
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
            res.status(404).json({ message: 'User not found' });
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