import * as controllers from "../controllers/blog.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"
import express from 'express'

router = express.Router()

router.post("/blog_post", verifyToken, controllers.createBlog);
router.get("/feed", verifyToken, controllers.getBlogFeed)

export default router;