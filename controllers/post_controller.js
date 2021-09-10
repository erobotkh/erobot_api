import asyncHandler from 'express-async-handler'
import Post from '../models/post_model.js'
import jsonapiSerializer from 'jsonapi-serializer'

var JSONAPISerializer = jsonapiSerializer.Serializer

const attributes = ['title', 'body', 'author', 'created_at', 'updated_at', 'reaction_count', 'comment_count', 'images', 'comments', 'reactions']
const relationshipAttributes = (_included) => {
  // const includes = _included.split(',')
  const map = {
    images: {
      ref: "id",
      included: true,
      attributes: ['url']
    },
    author: {
      ref: "id",
      included: true,
      attributes: ['first_name', 'last_name']
    },
  }
  return map
}


const fetchPosts = () => asyncHandler(async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 0
  const included = parseInt(req.query.included)

  const options = {
    page: page,
    limit: per_page,
    populate: 'author',
  }

  const posts = await Post.paginate({}, options)

  const PostsSerializer = new JSONAPISerializer('posts', {
    attributes: attributes,
    keyForAttribute: 'snake_case',
    pagination: true,
    meta: {
      count: posts.limit,
      total_count: posts.totalDocs,
      total_pages: posts.totalPages,
      current_page: posts.page,
    },
    topLevelLinks: {
      self: posts.page,
      next: posts.nextPage,
    },
    ...relationshipAttributes(included)
  })

  const _posts = PostsSerializer.serialize(posts.docs)
  res.send(_posts)
})

const fetchPostDetail = () => asyncHandler(async (req, res) => {
  const id = req.params.id
  const included = parseInt(req.query.included)

  if (!id) {
    res.send({ message: 'id not found' })
    return
  }

  try {
    const post = await Post.findById(id).populate('author').populate('comments')

    const PostsSerializer = new JSONAPISerializer('post', {
      attributes: attributes,
      keyForAttribute: 'snake_case',
      ...relationshipAttributes(included)
    })
    const _post = PostsSerializer.serialize(post)
    res.send(_post)
  } catch (error) {
    res.send({ message: "id not found" })
  }
})

const createPost = () => asyncHandler(async (req, res) => {

})

export { fetchPosts, fetchPostDetail, createPost }