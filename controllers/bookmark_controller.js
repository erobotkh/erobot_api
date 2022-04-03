import asyncHandler from "express-async-handler";
import Bookmark from "../models/bookmark_model.js";
import { buildItemsSerializer } from "../utils/json_serializer.js";

const fetchBookmarks = (req, res) =>
  asyncHandler(async (req, res) => {
    const per_page = parseInt(req.query.per_page) || 20;
    const page = parseInt(req.query.page) || 1;
    const user_id = req.user.id

    const options = {
      page: page,
      limit: per_page,
      user: user_id,
    };

    const bookmarks = await Bookmark.paginate({}, options);
    const _bookmarks = buildItemsSerializer({
      items: bookmarks,
      attributeSchema: Bookmark.schema,
      request: req,
      relationships: [],
    });

    res.send(_bookmarks);
  });

const toggleBookmark = (req, res) => asyncHandler(async (req, res) => {
  const user_id = req.user.id
  const post_id = req.query.post_id

  if(!post_id){
    res.send({
      "message": "Required Post ID"
    })
    return
  }

  const bookmarks = await Bookmark.find({
    user: user_id,
    post: post_id,
  })

  if (bookmarks.length > 0) {
    const response = await Bookmark.deleteMany({
      user: user_id,
      post: post_id,
    })

    res.send({
      "message": "Removed",
      "response": response,
    })
  } else {
    const response = await Bookmark.create({
      user: user_id,
      post: post_id,
    })

    res.send({
      "message": "Added",
      "response": response,
    })
  }
});

export { fetchBookmarks, toggleBookmark };
