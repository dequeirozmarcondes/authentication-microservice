import express from 'express';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';
import fs from 'fs';
import path from 'path';
import UserController from './controllers/UserController';
import connectDB from './config/db';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Carrega a especificação OpenAPI
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

// Conecta ao MongoDB
connectDB();

export default app;