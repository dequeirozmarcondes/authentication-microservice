import jwt from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/IUserRepository';
import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/UserRepository';

class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return token;
    }

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            return decoded;
        } catch (error) {
            return null;
        }
    }
}

export default new AuthService(UserRepository);
