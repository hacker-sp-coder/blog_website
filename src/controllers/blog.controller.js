import Blog from "../models/blogs.model.js"

// creating blog: 
export const createBlog = async (req, res) => {
    try {
        const { title, blog_image, content } = req.body;

        const authorId = req.user.id;
        if(!title || !content) {
            return res.status(404).json({
                msg: "title and content required"
            })
        }
        const newBlog = await Blog.create({
            title: title,
            blog_image: blog_image,
            author: authorId,
            content: content
        });

        return res.status(201).json({
            msg: "Blog created successfully",
            data: newBlog
        })

    } catch (error) {
        res.status(500).json({
            msg: "server error",
            error: error
        })
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