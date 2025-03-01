import jwt from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/IUserRepository';
import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/UserRepository';

class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }

        // Gera o access token (válido por 15 minutos)
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

        // Gera o refresh token (válido por 7 dias)
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'refreshSecret', { expiresIn: '7d' });

        return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string } | null> {
        try {
            // Verifica se o refresh token é válido
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret') as { id: string };

            // Gera um novo access token
            const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

            return { accessToken };
        } catch (error) {
            // Se o refresh token for inválido ou expirado, retorna null
            return null;
        }
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
