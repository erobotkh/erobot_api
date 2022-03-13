import asyncHandler from 'express-async-handler'
import Category from '../models/category_model.js'
import { buildItemsSerializer } from '../utils/json_serializer.js'

const fetchCategories = (req, res) => asyncHandler(async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 20
  const page = parseInt(req.query.page) || 1

  const options = {
    page: page,
    limit: per_page,
  }

  const categories = await Category.paginate({}, options)
  const _categories = buildItemsSerializer({
    items: categories,
    attributeSchema: Category.schema,
    request: req,
    relationships: []
  })

  res.send(_categories)
})

const createCategory = () => asyncHandler(async (req, res) => {
  const category_name = req.body.name

  if (!category_name) {
    res.send({
      message: 'Category name must not empty',
    })
    return;
  }

  const response = await Category.create({ name: category_name })
  if (response) {
    res.send({
      message: 'Category created',
      debug: response,
    })
  } else {
    res.send({
      message: 'Can\'t create category',
    })
  }
})

const updateCategory = () => asyncHandler(async (req, res) => {
  const category_name = req.body.name
  const category_id = req.params.category_id

  if (!category_name) {
    res.send({
      message: 'Category name must not empty',
    })
    return;
  }

  try {
    const old_category = await Category.findById(category_id)
    const response = await old_category.update({ name: category_name })
    res.send({
      message: 'Category updated',
      debug: response
    })
  } catch (error) {
    res.send({
      message: 'Update category fail',
    })
  }
})

// TODO: also delete its references to other posts
const deleteCategory = () => asyncHandler(async (req, res) => {
  const category_id = req.params.category_id
  try {
    const old_category = await Category.findById(category_id)
    const response = await old_category.delete()
    res.send({
      message: 'Delete deleted',
      debug: response
    })
  } catch (error) {
    res.send({
      message: 'Delete category fail',
      debug: error,
    })
  }
})

export { fetchCategories, createCategory, updateCategory, deleteCategory }