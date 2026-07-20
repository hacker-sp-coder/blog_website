import * as blogControllers from "../controllers/blog.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"
import express from 'express'

const router = express.Router()

// request at port /api/blog/
router.post("/blog_post", verifyToken, blogControllers.createBlog);
router.get("/feed", verifyToken, blogControllers.getBlogFeed);
router.post("/views/:blogId", verifyToken, blogControllers.incrementViews);

export default router;