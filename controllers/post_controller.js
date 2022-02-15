import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

import Post from '../models/post_model.js'
import User from '../models/user_model.js'
import Category from '../models/category_model.js'

import { buildItemsSerializer, buildObjectSerializer } from '../utils/json_serializer.js'
import { findHashtags } from '../utils/hashtags_extractor.js'
import { filterOutNullUndefine } from '../utils/utils.js'

const fetchPosts = () => asyncHandler(async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 0

  const options = {
    page: page,
    limit: per_page,
    populate: ['author', 'category'],
  }

  const posts = await Post.paginate({}, options)
  const _posts = buildItemsSerializer({
    items: posts,
    attributeSchema: Post.schema,
    request: req,
    relationships: {
      'author': User.schema,
      'images': Post.schema.obj.images[0],
      'category': Category.schema,
    },
    additionalAttributes: [
      'comment_count',
      'reaction_count'
    ],
    excludeAttributes: [
      'comments',
      'reactions',
    ],
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
    const post = await Post.findById(id).populate(['author', 'category'])
    const _post = buildObjectSerializer({
      item: post,
      attributeSchema: Post.schema,
      request: req,
      relationships: {
        'author': User.schema,
        'images': Post.schema.obj.images[0],
        'category': Category.schema,
      },
      additionalAttributes: [
        'comment_count',
        'reaction_count'
      ],
      excludeAttributes: [
        'comments',
        'reactions',
      ],
    })
    res.send(_post)
  } catch (error) {
    res.send({ message: "id not found" })
  }
})

// TODO: integrate upload with image
const createPost = () => asyncHandler(async (req, res) => {
  const createQuery = {
    title: req.body.title,
    body: req.body.body,
    category: req.body.category_id,
    author: req.user.id,
    tags: findHashtags(req.body.body),
  }

  try {
    const post = Post.create(filterOutNullUndefine(createQuery))
    res.send({
      message: "Post created successfully",
      response: post
    })
  } catch (error) {
    res.status(500).send({
      message: "Post created fail",
      error: error
    })
  }
})

const updatePost = () => asyncHandler(async (req, res) => {
  const updateQuery = {
    title: req.body.title,
    body: req.body.body,
    category: req.body.category_id,
    tags: findHashtags(req.body.body),
  }

  try {
    const post = await req.old_post.update(filterOutNullUndefine(updateQuery))
    res.send({
      message: "Post updated successfully",
      response: post
    })
  } catch (error) {
    res.status(500).send({
      message: "Post created fail",
      error: error
    })
  }
})

export { fetchPosts, fetchPostDetail, createPost, updatePost }