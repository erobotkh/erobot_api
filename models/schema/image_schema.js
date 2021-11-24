import mongoose from 'mongoose'

const imageSchema = mongoose.Schema(
  {
    type: String,
    url: String,
  },
)

export default imageSchema