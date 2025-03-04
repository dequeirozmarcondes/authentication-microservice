// // presentation/routes/authRoutes.ts
// import express from "express";
// import AuthController from "../controllers/AuthController.js";
// import { authenticate } from "../middlewares/authenticate-middleware.js";

// const authRouter = express.Router();

// // Rotas de autenticação
// authRouter.post("/login", AuthController.login);
// authRouter.post("/logout", authenticate, AuthController.logout);
// authRouter.post("/refresh-token", AuthController.refreshToken);

// export default authRouter;