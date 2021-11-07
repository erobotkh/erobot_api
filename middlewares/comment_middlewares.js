import dotenv from 'dotenv'
import Comment from '../models/comment_model.js'

dotenv.config()

const verifyCommentOwnership = async (req, res, next) => {
  const comment_id = req.params.comment_id
  const user_id = req.user.id
  const old_comment = await Comment.findById(comment_id)

  if(!old_comment) {
    return res.send({
      message: 'Couldn\'t find the comment',
    })
  }

  if (old_comment.user.toString() !== user_id) {
    return res.send({
      message: 'You can only modify your own comment',
    })
  }

  req.old_comment = old_comment
  return next();
};

export default verifyCommentOwnership