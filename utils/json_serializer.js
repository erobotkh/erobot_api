import { getTopLevelLinks, getMeta } from '../utils/link_pagination.js'
import jsonapiSerializer from 'jsonapi-serializer'
const JSONAPISerializer = jsonapiSerializer.Serializer

// Add, remove attribute from additionalAttributes, excludeAttributes 
// & Remove attribute with '_' at first index. eg. _id
function trimAttribute(args) {
  const attributeSchema = args['attributeSchema']
  const additionalAttributes = args['additionalAttributes'] || []
  const excludeAttributes = args['excludeAttributes'] || []

  const attributes = Object.keys(attributeSchema.tree)
  attributes.concat(additionalAttributes)
  const _attributes = attributes.filter(arrayItem => {
    return !excludeAttributes.includes(arrayItem) && !(arrayItem[0] === "_")
  });

  return _attributes
}

/**
 * Example: 
```js
const options = { populate: 'author' }
const posts = await Post.paginate({}, options)

const serializedItems = buildItemsSerializer({
  items: posts,
  attributeSchema: Post.schema,
  request: req,
  relationships: {
    'author': User.schema,
    'images': Post.schema.obj.images[0]
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

res.send(serializedItems)
```
*/
function buildItemsSerializer(args) {
  const items = args['items']
  const request = args['request']
  const relationships = args['relationships']
  const attributes = trimAttribute(args)

  let type = '';
  if (items.docs && items.docs.length > 0) {
    type = items.docs[0]['type'] ?? 'collection';
  }

  const ItemsSerializer = new JSONAPISerializer(type, {
    attributes: attributes,
    keyForAttribute: 'snake_case',
    pagination: true,
    meta: getMeta(items, request),
    topLevelLinks: getTopLevelLinks(items, request),
    ...relationshipAttributes(request, relationships)
  })

  return ItemsSerializer.serialize(items.docs)
}

/**
 * @param {list} additionalAttributes - The string
 *
 * Example: 
 * 
```js
const post = await Post.findById(id).populate('author').populate('comments')

const serializedObject = buildObjectSerializer({
  item: post,
  attributeSchema: Post.schema,
  request: req,
  relationships: {
    'author': User.schema,
    'images': Post.schema.obj.images[0]
  },
  additionalAttributes: [
    'comment_count',
    'reaction_count'
  ],
  excludeAttributes: [
    'comments',
    'reactions',
  ]
})

res.send(serializedObject)
```
*/
function buildObjectSerializer(args) {
  const item = args['item']
  const request = args['request']
  const relationships = args['relationships']
  const attributes = trimAttribute(args)

  const PostsSerializer = new JSONAPISerializer('post', {
    attributes: attributes,
    keyForAttribute: 'snake_case',
    ...relationshipAttributes(request, relationships)
  })

  return PostsSerializer.serialize(item)
}

function relationshipAttributes(req, relationships) {
  const included = req.query.included
  const _includes = included != null ? included.toString().split(',') : [];

  const map = {}
  for (let key of Object.keys(relationships)) {
    map[key] = {
      ref: "id",
      included: _includes.includes(key),
      attributes: Object.keys(relationships[key].tree)
    }
  }

  return map
}

export { buildItemsSerializer, buildObjectSerializer }