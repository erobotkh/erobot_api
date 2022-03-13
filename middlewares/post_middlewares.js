import dotenv from 'dotenv'
import Post from '../models/post_model.js';
import mongoose from "mongoose";

dotenv.config()

const verifyPostOwnership = async (req, res, next) => {
  const post_id = req.params.id
  const user_id = req.user.id
  const old_post = await Post.findById(post_id)

  if (!old_post) {
    return res.status(404).send({
      message: 'Couldn\'t find the post',
    })
  }

  if (old_post.author.toString() !== user_id) {
    return res.status(403).send({
      message: "You can only modify your own post",
    })
  }

  req.old_post = old_post
  return next();
};

const validateCategoryId = async (req, res, next) => {
  const id = req.body.category_id
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send({
      message: 'Category not found',
    })
    return;
  }
  return next();
}

export { verifyPostOwnership, validateCategoryId }