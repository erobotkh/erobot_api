import { getTopLevelLinks, getMeta } from '../utils/link_pagination.js'
import jsonapiSerializer from 'jsonapi-serializer'
const JSONAPISerializer = jsonapiSerializer.Serializer

/**
 * Example: 
```js
const options = { populate: 'author' }

const posts = await Post.paginate({}, options)
const serializedObject = buildItemsSerializer(posts, Post.schema, req, {
  'author': User.schema,
  'images': Post.schema.obj.images[0]
})

res.send(serializedObject)
```
*/
function buildItemsSerializer (items, attributeSchema, request, relationships) {
  let type = '';
  if (items.docs && items.docs.length > 0) {
    type = items.docs[0]['type'] ?? 'collection';
  }
  
  const attributes = Object.keys(attributeSchema.tree)
  
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
 * Example: 
```js
const post = await Post.findById(id).populate('author').populate('comments')
const _post = buildObjectSerializer(post, Post.schema, req, {
  'author': User.schema,
  'images': Post.schema.obj.images[0]
})
res.send(_post)
```
*/
function buildObjectSerializer(item, attributeSchema, request, relationships) {
  const attributes = Object.keys(attributeSchema.tree)

  const PostsSerializer = new JSONAPISerializer('post', {
    attributes: attributes,
    keyForAttribute: 'snake_case',
    ...relationshipAttributes(request, relationships)
  })

  return PostsSerializer.serialize(item)
}

function relationshipAttributes (req, relationships) {
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