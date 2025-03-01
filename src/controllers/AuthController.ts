import { Request, Response } from 'express';
import AuthService from '../authentication-jwt/AuthService';
import { loginUserSchema } from '../schemas/userValidation';

class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        const { error } = loginUserSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { email, password } = req.body;
        const token = await AuthService.login(email, password);

        if (!token) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        res.json({ token });
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token is required' });
            return;
        }

        const newTokens = await AuthService.refreshToken(refreshToken);

        if (!newTokens) {
            res.status(400).json({ message: 'Invalid refresh token' });
            return;
        }

        res.json(newTokens); // Retorna o novo accessToken
    }
}

export default new AuthController();