import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be ObjectId or string for admin
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    action: { type: String, enum: ['create', 'update', 'delete'], required: true },
    userName: { type: String }, // Store user name directly for admin activities
    userRole: { type: String } // Store user role
  },
  { timestamps: true }
)

export default mongoose.model('Activity', activitySchema)

