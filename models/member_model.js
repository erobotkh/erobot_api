import mongoose from 'mongoose'
import normalize from 'normalize-mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import socialSchema from './schema/social_schema.js'
import Team from './team_model.js'

const memberSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    type: { type: String, default: 'member' },
    role: {
      type: String,
      enum: ['leader', 'coleader', 'member'],
      default: 'member',
      required: true,
    },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    profile_url: { type: String, default: null },
    socials: [socialSchema],
    team: { type: mongoose.Types.ObjectId, ref: Team },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  }
)

memberSchema.plugin(normalize)
memberSchema.plugin(mongoosePaginate)

const Member = mongoose.model('Member', memberSchema)
export default Member