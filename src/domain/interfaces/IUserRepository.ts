//src/interfaces/IUserRepository.ts

import { CreateUserDTO, UpdateUserDTO } from '../../presentation/dtos/UserDTO';
import { IUser } from '../entities/User';

export interface IUserRepository {
    create(data: CreateUserDTO): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    update(id: string, data: UpdateUserDTO): Promise<IUser | null>;
    delete(id: string): Promise<void>;
}