import * as userController from '../controllers/user.controller.js'
import {verifyToken} from "../middlewares/auth.middleware.js"
import express from 'express'

const router = express.Router()

router.post("/register", userController.handleRegister);

router.post("/login", userController.handleLogin);

router.get("/getMe", verifyToken, userController.handleGetMe);

router.get("/getRefreshToken", userController.handleRefreshToken);

export default router;