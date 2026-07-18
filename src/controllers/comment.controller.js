import Comments from "../models/comments.model.js"
import Blog from "../models/blogs.model.js";

export const addComment = async (req, res) => {
    try {
        const {blogId} = req.params;
        const {comment_content} = req.body;
        const userId = req.user.id;

        if(!comment_content) {
            return res.status(400).json({
                msg: "comment required"
            })
        }

        const newComment = await Comment.create({
            userId,
            blogId,
            comment_content
        });

        return res.status(201).json({
            msg: "comment added",
            data: newComment
        });

    } catch (error) {
        return res.status(500).json({msg: "server error : ",error})
    }
};

export const getBlogComments = async (req,res) =>{
    try {
        const {blogId} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1) * 10;

        const comments = await Comment.find({blogId})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate("userId", "username name") 
            .lean();

            return res.status(200).json({msg: "success", data: comments})

    } catch (error) {
        return res.status(500).json({msg: "Server error : ",error});
    }
}