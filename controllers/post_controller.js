import asyncHandler from 'express-async-handler'
import Post from '../models/post_model.js'
import { buildItemsSerializer, buildObjectSerializer } from '../utils/json_serializer.js'
import User from '../models/user_model.js'

const fetchPosts = () => asyncHandler(async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 0

  const options = {
    page: page,
    limit: per_page,
    populate: 'author',
  }

  const posts = await Post.paginate({}, options)
  const _posts = buildItemsSerializer(posts, Post.schema, req, {
    'author': User.schema,
    'images': Post.schema.obj.images[0]
  })

  res.send(_posts)
})

const fetchPostDetail = () => asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.send({ message: 'id not found' })
    return
  }

  try {
    const post = await Post.findById(id).populate('author').populate('comments')
    const _post = buildObjectSerializer(post, Post.schema, req, {
      'author': User.schema,
      'images': Post.schema.obj.images[0]
    })
    res.send(_post)
  } catch (error) {
    res.send({ message: "id not found" })
  }
})

const createPost = () => asyncHandler(async (req, res) => {

})

export { fetchPosts, fetchPostDetail, createPost }