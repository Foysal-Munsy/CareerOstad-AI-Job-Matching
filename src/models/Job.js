import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobCategory',
    required: false
  },
  employmentType: String,
  jobLevel: String,
  overview: String,
  requirements: String,
  preferredQualifications: String,
  toolsTechnologies: [String],
  location: String,
  workMode: String,
  salaryMin: Number,
  salaryMax: Number,
  salaryType: String,
  isNegotiable: Boolean,
  perksBenefits: String,
  applicationDeadline: Date,
  howToApply: String,
  applicationUrl: String,
  applicationEmail: String,
  numberOfVacancies: Number,
  experienceRequired: String,
  educationRequired: String,
  genderPreference: String,
  ageLimit: String,
  tags: [String],
  companyName: String,
  companyEmail: String,
  companyWebsite: String,
  companyProviderAccountId: String,
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'closed']
  },
  isFeatured: {
    type: Boolean,
    default: false
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

// Only compile the model if it doesn't already exist
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;

