import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  courseCategory: String,
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  verificationUrl: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  issuerName: {
    type: String,
    default: 'CareerOstad'
  },
  issuerLogo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate unique certificate ID
CertificateSchema.statics.generateCertificateId = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CO-';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);

export default Certificate;

