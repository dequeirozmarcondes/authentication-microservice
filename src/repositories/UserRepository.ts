//src/repositories/UserRepository.ts

import { User, IUser } from '../models/User';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/UserDTO';
import { IUserRepository } from '../interfaces/IUserRepository';

class UserRepository implements IUserRepository {
    async create(data: CreateUserDTO): Promise<IUser> {
        try {
            const user = new User(data);
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Failed to create user');
        }
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error('Failed to find user by email');
        }
    }

    async findById(id: string): Promise<IUser | null> {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error('Failed to find user by ID');
        }
    }

    async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error('Failed to update user');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Failed to delete user');
        }
    }
}

export default new UserRepository();