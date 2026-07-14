import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    comment_content: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const Comments = mongoose.model("Comments", commentSchema);