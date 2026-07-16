import Blog from "../models/blogs.model.js";
import Reactions from "../models/reactions.model.js"

export const toggleReaction = async(req, res) => {
    try {
        const { blogId } = req.params;
        const { action } = req.body;
        const userId = req.user.id;

        if(action!== 'like' || action!== 'dislike') {
            return res.status(400).json({
                msg: "Invalid action type."
            })
        }
        
        // incase, user has already reacted 
        const prevAction = await Reactions.findOne({userId, blogId});

        //Setting up variables to track how Blog counters should change
        let likeChange = 0;
        let dislikeChange = 0;
        let responseMsg= "";

        //if user has already reacted before
        if(prevAction) {
            if(prevAction === action) {
                await Reactions.findByIdAndDelete(prevAction._id);

                action === 'like' ? (likeChange= -1): (dislikeChange=-1);
                responseMsg = "Reaction removed"
            } else {
                prevAction.type = action;
                await prevAction.save();

                if(action==='like'){
                    likeChange =1;
                    dislikeChange=-1;
                }else {
                    likeChange =-1;
                    dislikeChange=1;
                }
                responseMsg= `Reaction changed to ${action}`;
            }
        }
        else {
            Reactions.create({
                userId,
                blogId,
                type: action
            });
            action ='like'? (likeChange=1): (dislikeChange=1);
            responseMsg =`Successfully ${action}d`;
        }
        
        await Blog.findByIdAndUpdate(blogId,{
            $inc: {
                likes_count: likeChange,
                dislike_count: dislikeChange
            }
        });

        return res.status(200).json({
            msg: "res"
        })

    } catch (error) {
        return res.status(500).json({msg: "server error : ",error})
    }
}