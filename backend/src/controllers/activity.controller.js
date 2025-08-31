import Activity from '../models/Activity.js'

export async function latestActivities(req, res, next) {
  try {
    const items = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('document', 'title')
    
    // Handle population manually for mixed user types
    const processedItems = await Promise.all(items.map(async (item) => {
      const plainItem = item.toObject()
      
      if (item.user === 'admin') {
        // Admin user from env
        plainItem.user = {
          _id: 'admin',
          name: item.userName || 'Administrator',
          email: 'admin@system.local'
        }
      } else {
        // Regular user from database - populate manually
        const User = (await import('../models/User.js')).default
        const user = await User.findById(item.user, 'name email')
        plainItem.user = user
      }
      
      return plainItem
    }))
    
    res.json(processedItems)
  } catch (e) {
    next(e)
  }
}

