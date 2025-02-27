import UserRepository from '../repositories/UserRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserService {
    async create(userData: CreateUserDTO): Promise<UserResponseDTO> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await UserRepository.create({ ...userData, password: hashedPassword });

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = await UserRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return token;
    }

    async getById(id: string): Promise<UserResponseDTO | null> {
        const user = await UserRepository.findById(id);
        if (!user) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }

    async update(id: string, userData: UpdateUserDTO): Promise<UserResponseDTO | null> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const user = await UserRepository.update(id, userData);
        if (!user) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }

    async delete(id: string): Promise<void> {
        await UserRepository.delete(id);
    }
}

export default new UserService();