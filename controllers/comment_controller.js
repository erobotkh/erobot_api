import asyncHandler from 'express-async-handler'
import Comment from '../models/comment_model.js'
import Post from '../models/post_model.js'
import User from '../models/user_model.js'
import { buildItemsSerializer } from '../utils/json_serializer.js'

const fetchComments = (req, res) => asyncHandler(async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 1

  const options = {
    page: page,
    limit: per_page,
    populate: 'user'
  }

  const comments = await Comment.paginate({}, options)
  const _comments = buildItemsSerializer({
    items: comments,
    attributeSchema: Comment.schema,
    request: req,
    relationships: {
      'user': User.schema,
    },
  })

  res.send(_comments)
})

const fetchCommentsPerPost = () => asyncHandler(async (req, res) => {
  const post_id = req.params.id
  if (!post_id) {
    res.send({
      message: 'assert: post_id must be provided',
    })
    return
  }

  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 1

  const options = {
    page: page,
    limit: per_page,
    populate: 'user'
  }

  const filter = {
    post: post_id,
  }

  const comments = await Comment.paginate(filter, options)
  const _comments = buildItemsSerializer({
    items: comments,
    attributeSchema: Comment.schema,
    request: req,
    relationships: {
      'user': User.schema,
    }
  })

  res.send(_comments)
})

const createComment = () => asyncHandler(async (req, res, next) => {
  const post_id = req.body.post_id
  const comment = req.body.comment
  const user_id = req.user.id

  if (!post_id) {
    res.send({
      message: 'Post not found',
    })
    return;
  } else if (!comment) {
    let err = Error('Comment can\'t be empty'); // Sets error message, includes the requester's ip address!
    err.statusCode = 403;
    next(err)
    return;
  }

  const response = await Comment.create({ user: user_id, comment: comment, post: post_id })
  if (response) {
    const post = await Post.findByIdAndUpdate(post_id);
    post.comments.push(response._id)
    post.save()
    res.send({
      message: 'Comment created',
    })
  } else {
    res.send({
      message: 'Can\'t create comment',
    })
  }
})

const updateComment = () => asyncHandler(async (req, res) => {
  const comment = req.body.comment

  if (!comment) {
    res.send({
      message: 'Comment can\'t be empty',
    })
    return;
  }

  try {
    const response = await req.old_comment.update({ comment })
    res.send({
      message: 'Comment updated',
      response: response
    })
  } catch (error) {
    res.send({
      message: 'Update comment fail',
    })
  }
})

const deleteComment = () => asyncHandler(async (req, res) => {
  try {
    const response = await req.old_comment.delete()

    if (response) {
      const post = await Post.findByIdAndUpdate(req.old_comment.post.toString())
      post.comments.pull({ _id: response._id })
      post.save()

      res.send({
        message: 'Comment deleted',
        response: response
      })
    } else {
      res.send({
        message: 'Comment not found or Post not found',
      })
    }
  } catch (error) {
    res.send({
      message: 'Delete comment fail',
      response: error,
    })
  }
})

export { fetchComments, fetchCommentsPerPost, createComment, updateComment, deleteComment }