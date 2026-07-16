import * as userController from '../controllers/user.controller.js'
import {verifyToken} from "../middlewares/auth.middleware.js"
import express from 'express'

const router = express.Router()

router.post("/register", verifyToken, userController.handleRegister);

router.post("/login", verifyToken, userController.handleLogin);

router.get("/getMe", verifyToken, userController.handleGetMe);

router.get("/getRefreshToken", verifyToken, userController.handleRefreshToken);

export default router;