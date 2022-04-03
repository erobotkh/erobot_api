import asyncHandler from 'express-async-handler'
import Member from '../models/member_model.js';
import User from '../models/user_model.js';
import { buildObjectSerializer } from '../utils/json_serializer.js';

async function fetchOne(user_id, req) {
  let user = await User.findById(user_id).populate(['member'])
  let _user = buildObjectSerializer({
    item: user,
    attributeSchema: User.schema,
    request: req,
    relationships: {
      "member": Member.schema,
    },
    excludeAttributes: [
      "id"
    ],
  })
  return _user
}

const fetchProfile = () => asyncHandler(async (req, res) => {
  const user_id = req.params.user_id ?? req.user.id;

  if (!user_id) {
    res.send({ message: 'Missing user_id' })
    return
  }

  try {
    res.send(await fetchOne(user_id, req))
  } catch (error) {
    console.log(error)
    req.next(error)
  }
})

const updateProfile = () => asyncHandler(async (req, res) => {
  const user_id = req.params.user_id ?? req.user.id;
  const body = req.body;
  const modifiable = ["first_name", "last_name", "profile_url", "member"];
  
  for (const key in body) {
    if(!modifiable.includes(key)){
      res.status(400).send({
        "message": key + " is not modifiable",
      });
      return
    }
  }
  
  try {
    res.send(await fetchOne(user_id, req))
  } catch (error) {
    console.log(error)
    req.next(error)
  }
})

export { fetchProfile, updateProfile }