import mongoose from "mongoose";
import normalize from "normalize-mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import User from "./user_model.js";
import Post from "./post_model.js";

const bookmarkSchema = mongoose.Schema(
  {
    type: { type: String, default: "bookmark" },
    user: { type: mongoose.Types.ObjectId, ref: User },
    post: { type: mongoose.Types.ObjectId, ref: Post },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

bookmarkSchema.plugin(normalize);
bookmarkSchema.plugin(mongoosePaginate);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
