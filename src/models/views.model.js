import mongoose from "mongoose"

const viewsSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    }
},{
    timestamps: true
}
);

const Views = mongoose.model("Views", viewsSchema);

export default Views;