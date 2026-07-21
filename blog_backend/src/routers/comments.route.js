import { verifyToken } from "../middlewares/auth.middleware.js";
import * as commentController from "../controllers/comment.controller.js";
import express from "express";

const router = express.Router();

router.post("/comments/addComment/:blogId", verifyToken, commentController.addComment);

router.get("/comments/getComment/:blogId", verifyToken, commentController.getBlogComments);

export default router;
