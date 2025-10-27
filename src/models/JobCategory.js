import mongoose from 'mongoose';

const JobCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt timestamp before saving
JobCategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Only compile the model if it doesn't already exist
const JobCategory = mongoose.models.JobCategory || mongoose.model('JobCategory', JobCategorySchema);

export default JobCategory;

