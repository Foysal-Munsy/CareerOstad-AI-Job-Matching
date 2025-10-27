import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Cloud Computing',
      'Cybersecurity',
      'DevOps',
      'UI/UX Design',
      'Digital Marketing',
      'Business Analysis',
      'Project Management',
      'Other'
    ]
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: Number, // Duration in hours
    required: true
  },
  thumbnail: {
    type: String, // Cloudinary or URL
    default: ''
  },
  instructorName: {
    type: String,
    default: 'CareerOstad Team'
  },
  instructorImage: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0 // Free courses have 0 price
  },
  currency: {
    type: String,
    default: 'USD'
  },
  tags: [String],
  lessons: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    content: {
      type: String, // Can be video URL, PDF URL, or text content
      required: true
    },
    contentType: {
      type: String,
      enum: ['video', 'pdf', 'text', 'quiz', 'link'],
      default: 'text'
    },
    duration: Number, // minutes
    order: Number,
    isFreePreview: {
      type: Boolean,
      default: false
    }
  }],
  resources: [{
    title: String,
    url: String,
    type: String // 'pdf', 'doc', 'external-link'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
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

// Update enrolled students count
CourseSchema.methods.incrementEnrollment = function() {
  this.enrolledStudents += 1;
  return this.save();
};

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export default Course;

