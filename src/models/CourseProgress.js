import mongoose from 'mongoose';

const CourseProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  completedLessons: [{
    lessonOrder: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalLessons: {
    type: Number,
    default: 0
  },
  progressPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: String,
    default: ''
  },
  notes: String, // User can add personal notes
  timeSpent: {
    type: Number,
    default: 0 // in minutes
  }
}, {
  timestamps: true
});

// Index for efficient queries
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
CourseProgressSchema.index({ userId: 1 });
CourseProgressSchema.index({ courseId: 1 });

// Update progress percentage
CourseProgressSchema.methods.updateProgress = function() {
  this.progressPercent = this.totalLessons > 0 
    ? Math.round((this.completedLessons.length / this.totalLessons) * 100) 
    : 0;
  
  if (this.progressPercent === 100) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Mark lesson as complete
CourseProgressSchema.methods.markLessonComplete = function(lessonOrder) {
  const isAlreadyCompleted = this.completedLessons.some(
    lesson => lesson.lessonOrder === lessonOrder
  );
  
  if (!isAlreadyCompleted) {
    this.completedLessons.push({
      lessonOrder,
      completedAt: new Date()
    });
    return this.updateProgress();
  }
  
  return Promise.resolve(this);
};

const CourseProgress = mongoose.models.CourseProgress || mongoose.model('CourseProgress', CourseProgressSchema);

export default CourseProgress;

