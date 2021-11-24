import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import imageSchema from './schema/image_schema.js'

const robotSchema = mongoose.Schema(
  {
    type: { type: String, default: 'robot' },
    name: { type: String, required: true },
    image: imageSchema,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
)

robotSchema.plugin(normalize)
robotSchema.plugin(mongoosePaginate)

const Robot = mongoose.model('Robot', robotSchema)
export default Robot