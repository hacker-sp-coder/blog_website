import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Blog from "../models/blogs.model.js";

export const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user.id;

        // 1. Check if an image was uploaded
        const localImagePath = req.file?.path;
        let blogImageUrl = "";

        // 2. If it was, upload to Cloudinary
        if (localImagePath) {
            const uploadedImage = await uploadOnCloudinary(localImagePath);
            if (uploadedImage) {
                blogImageUrl = uploadedImage.secure_url;
            }
        }

        // 3. Create the blog with the URL
        const newBlog = await Blog.create({
            title: title,
            content: content,
            author: authorId,
            blog_image: blogImageUrl // Now stores the live Cloudinary URL
        });

        return res.status(201).json({
            msg: "Blog created successfully",
            data: newBlog
        });

    } catch (error) {
        res.status(500).json({ msg: "server error", error: error.message });
    }
} 

// Feed logic:
export const getBlogFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blog = await Blog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username name')
            .lean();

        // we are taking record of total number of Blogs present in     
        const totalBlogs = await Blog.countDocuments();

        res.status(200).json({
            msg: "blog is ready",
            data: blog,
            page: page,
            totalPages: Math.ceil(totalBlogs / limit),
            totalBlogs
        });
    } catch (error) {
        res.status(500).json({
            msg: "server error",
            error: error
        })
    }
}

export const incrementViews = async (req, res) => {
    try {
        const { blogId } = req.params;

        await Blog.findByIdAndUpdate(blogId, {
            $inc: { views_count: 1 }
        });

        return res.status(200).json({ msg: "Views incremented! " })
    } catch (error) {
        return res.status(500).json({msg: "server error: ",error})
    }
}

