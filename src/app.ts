import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import fs from 'fs';
import { dirname } from 'path';
import path from 'path';
import UserController from './controllers/UserController';
import connectDB from './config/db';
import { fileURLToPath } from 'url';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Carrega a especificação OpenAPI
const __filename = fileURLToPath(import.meta.url);
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
app.post('/users/login', UserController.login);
app.get('/users/:id', UserController.getById);
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