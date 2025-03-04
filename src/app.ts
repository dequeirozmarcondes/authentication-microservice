//src/app.ts

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import fs from 'fs';
import { dirname } from 'path';
import path from 'path';
import UserController from './presentation/controllers/UserController.js';
import connectDB from './infrastructure/database/configMongoose.js';
import { fileURLToPath } from 'url';

import { authenticate } from './presentation/middlewares/authenticate-middleware.js';
import AuthController from './presentation/controllers/AuthController.js';

const app: any = express();

// Middleware
app.use(cors());
app.use(express.json());

// Carrega a especificação OpenAPI
const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = dirname(__filename);

const openApiSpecification = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../openapi.json'), 'utf-8')
);

// Rota para a documentação da API
app.use(
    '/reference',
    apiReference({
        spec: {
            content: openApiSpecification,
        },
    }),
);

// Rotas da API
app.post('/users', UserController.create);
app.post('/users/login', AuthController.login);
app.post('/users/logout', authenticate, AuthController.logout);
app.post('/users/refresh-token', AuthController.refreshToken);
app.get('/users/:id', authenticate, UserController.getById);
app.put('/users/:id', UserController.update);
app.delete('/users/:id', UserController.delete);

// Tratamento de erros global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Conecta ao MongoDB
connectDB();

export default app;