import { Request, Response } from 'express';
import UserService from '../services/UserService';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/UserDTO';

class UserController {
    async create(req: Request, res: Response): Promise<void> {
        const userData: CreateUserDTO = req.body;
        const user = await UserService.create(userData);
        res.status(201).json(user);
    }

    async login(req: Request, res: Response): Promise<void> {
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