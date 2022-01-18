import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const teamSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, default: 'team' },
    name: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
)

teamSchema.plugin(normalize)
teamSchema.plugin(mongoosePaginate)

const Team = mongoose.model('Team', teamSchema)
export default Team