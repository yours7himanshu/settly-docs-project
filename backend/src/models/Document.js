import mongoose from 'mongoose'

const versionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tags: [String],
    summary: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { _id: false }
)

const docSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: 'text' },
    content: { type: String, required: true },
    tags: { type: [String], default: [], index: true },
    summary: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    embedding: { type: [Number], default: [] },
    versions: { type: [versionSchema], default: [] }
  },
  { timestamps: true }
)

docSchema.index({ title: 'text', content: 'text', tags: 'text' })

export default mongoose.model('Document', docSchema)

