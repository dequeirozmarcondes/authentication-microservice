import { CreateUserDTO, UpdateUserDTO } from '../dtos/UserDTO';
import { IUser } from '../models/User';

export interface IUserRepository {
    create(data: CreateUserDTO): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    update(id: string, data: UpdateUserDTO): Promise<IUser | null>;
    delete(id: string): Promise<void>;
}