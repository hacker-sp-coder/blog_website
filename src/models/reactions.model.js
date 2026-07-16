import mongoose from "mongoose"

const reactionsSchema = new mongoose.Schema({
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
    type:{
        type: String,
        enum: ['like', 'dislike'],
        required: true
    }
},{
    timestamps: true
}
);

// i want one user can do only one like/dislike to a blog 
reactionsSchema.index({userId: 1, blogId: 1}, {unique: true});

const Reactions = mongoose.model("Reactions", reactionsSchema);