// // presentation/routes/userRoutes.ts
// import express from "express";
// import { UserController } from "../controllers/UserController.js";
// import { authenticate } from "../middlewares/authenticate-middleware.js";

// const userRouter = express.Router();
// const userController = new UserController();

// // Rotas de usuário
// userRouter.post("/", userController.create.bind(userController));
// userRouter.get("/:id", authenticate, userController.getById.bind(userController));
// userRouter.put("/:id", userController.update.bind(userController));
// userRouter.delete("/:id", userController.delete.bind(userController));

// export default userRouter;