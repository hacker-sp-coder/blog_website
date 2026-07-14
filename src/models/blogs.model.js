import mongoose from "mongoose";
import User from "./user.model";

const blogSchema = new mongoose.Schema({
    author: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    title: {
        type : String,
        required: true
    },
    blog_image: {
        type: String
    },
    content: {
        type : String,
        required : true
    },
    likes_count: {
        type: Number,
        default: 0
    },
    comment_count: {
        type: Number,
        default: 0
    },

},{
    timestamps: true
}
)

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;