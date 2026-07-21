import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js"
import * as reactionController from "../controllers/reaction.controller.js"

const router = express.Router()

router.post("/reactions/:blogId", verifyToken, reactionController.toggleReaction);


export default router;