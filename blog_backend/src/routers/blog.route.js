import * as blogControllers from "../controllers/blog.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import express from 'express'

const router = express.Router()

// request at port /api/blog/
router.get("/feed", verifyToken, blogControllers.getBlogFeed);
router.post("/views/:blogId", verifyToken, blogControllers.incrementViews);

// Note the new upload.single() middleware
router.post("/blog_post", verifyToken, upload.single("blog_image"), blogControllers.createBlog);

export default router;