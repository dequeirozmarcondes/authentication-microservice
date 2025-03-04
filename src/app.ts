import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./infrastructure/database/configMongoose.js";
import fs from "fs";
import path from "path";
import { apiReference } from "@scalar/express-api-reference";
import { fileURLToPath } from "url";
import { UserController } from "./presentation/controllers/UserController.js";
import { UserService } from "./application/services/UserService.js";
import { UserRepository } from "./presentation/repositories/UserRepository.js";
import { AuthController } from "./presentation/controllers/AuthController.js";
import { AuthService } from "./infrastructure/authentication-jwt/AuthService.js";
import { authenticate } from "./presentation/middlewares/authenticate-middleware.js";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Carrega a especificação OpenAPI
const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const openApiSpecification = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../openapi.json"), "utf-8"),
);

// Rota para a documentação da API
app.use(
  "/reference",
  apiReference({
    spec: {
      content: openApiSpecification,
    },
  }),
);

// Instância do UserRepository
const userRepository = new UserRepository();

// Instância do AuthService com UserRepository injetado
const authService = new AuthService(userRepository);

// Instância do AuthController com AuthService injetado
const authController = new AuthController(authService);

// Instância do UserService com UserRepository injetado
const userService = new UserService(userRepository);

// Instância do UserController com UserService injetado
const userController = new UserController(userService);

// Rotas da API
app.post("/users", userController.create.bind(userController));
app.get("/users/:id", authenticate, userController.findById.bind(userController));
app.put("/users/:id", userController.update.bind(userController));
app.delete("/users/:id", userController.delete.bind(userController));
app.post("/users/login", authController.login.bind(authController));
app.post("/users/logout", authenticate, authController.logout.bind(authController));
app.post("/users/refresh-token", authController.refreshToken.bind(authController));

// Tratamento de erros global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Conecta ao MongoDB
connectDB();

export default app;