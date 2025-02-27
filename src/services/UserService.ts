import { IUserRepository } from '../interfaces/IUserRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async create(userData: CreateUserDTO): Promise<UserResponseDTO> {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(userData.password)) {
            throw new Error('Password must be at least 8 characters long and contain at least one letter and one number');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.userRepository.create({ ...userData, password: hashedPassword });

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return token;
    }

    async getById(id: string): Promise<UserResponseDTO | null> {
        const user = await this.userRepository.findById(id);
        if (!user) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }

    async update(id: string, userData: UpdateUserDTO): Promise<UserResponseDTO | null> {
        if (userData.password) {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(userData.password)) {
                throw new Error('Password must be at least 8 characters long and contain at least one letter and one number');
            }
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const user = await this.userRepository.update(id, userData);
        if (!user) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}

// Exporta uma instância do serviço com o repositório padrão
import UserRepository from '../repositories/UserRepository';
export default new UserService(UserRepository);