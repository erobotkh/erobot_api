import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

import Post from '../models/post_model.js'
import User from '../models/user_model.js'
import Category from '../models/category_model.js'

import { buildItemsSerializer, buildObjectSerializer } from '../utils/json_serializer.js'
import { findHashtags } from '../utils/hashtags_extractor.js'
import { filterOutNullUndefine } from '../utils/utils.js'
import PostReaction from '../models/post_reaction_model.js'

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
        // 'reactions',
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
      debug: post
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
      debug: post
    })
  } catch (error) {
    res.status(500).send({
      message: "Post created fail",
      error: error
    })
  }
})

// reaction id = post_id + "_" +  user_id
const toggleReaction = () => asyncHandler(async (req, res) => {
  const post_id = req.params.id
  const user_id = req.user.id
  const reaction_type = req.query.type

  const old_post = await Post.findById(post_id)
  const reactions = await PostReaction.find({
    post: old_post.id,
    user: req.user.id
  })

  try {
    if (reactions.length > 0) {
      // remove reaction from its collection
      for (let i = 0; i < reactions.length; i++) {
        const reaction_id = reactions[i].id;
        await PostReaction.findByIdAndRemove(reaction_id)
        if (old_post.reactions) await old_post.reactions.pop(reaction_id)
      }

      // remove reaction from post array
      await old_post.save()

      res.send({
        message: "Reaction removed successfully",
      })
    } else {
      // create post reaction to its collection
      const reaction = await PostReaction.create({
        user: user_id,
        post: post_id,
        reaction_type: reaction_type
      })

      // add reaction from post array
      if (old_post.reactions) {
        await old_post.reactions.push(reaction.id)
        await old_post.save()
      } else {
        await old_post.updateOne({ reactions: [reaction.id] })
      }

      res.send({
        message: "Reaction set successfully",
        reaction: reaction,
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "Reaction set fail",
      error: error
    })
  }
})

export { fetchPosts, fetchPostDetail, createPost, updatePost, toggleReaction }