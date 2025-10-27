# Learning Management System (LMS) - CareerOstad

## 🎓 Overview

Complete Learning Management System integrated into CareerOstad platform, designed for both Admin and Candidate roles. This system enables users to learn new skills aligned with their AI-recommended career paths, track their learning progress, and earn digital certificates upon course completion.

## ✨ Features

### For Admins
- **Course Management**: Add, edit, delete courses
- **Content Management**: Upload videos, PDFs, links, and text content
- **Statistics Dashboard**: View total courses, active learners, certificates issued, and completion rates
- **Course Activation**: Toggle course active/inactive status
- **Featured Courses**: Mark courses as featured for special promotion

### For Candidates
- **Learning Dashboard**: Personalized learning dashboard with progress tracking
- **Course Discovery**: Browse all courses, recommended courses, and enrolled courses
- **Progress Tracking**: Visual progress bars showing completion percentage
- **Lesson Management**: Track completed lessons with "Mark as Complete" functionality
- **Certification**: Download PDF certificates upon course completion
- **Certificate Verification**: Unique certificate IDs for verification

## 📁 Structure

### Backend Components

#### Models
- **`src/models/Course.js`**: Course schema with lessons, resources, metadata
- **`src/models/CourseProgress.js`**: User progress tracking per course
- **`src/models/Certificate.js`**: Certificate generation and verification

#### API Routes
- **`src/app/api/courses/route.js`**: GET (list courses), POST (create course)
- **`src/app/api/courses/[id]/route.js`**: GET, PUT, DELETE for individual courses
- **`src/app/api/courses/enroll/route.js`**: Course enrollment
- **`src/app/api/courses/progress/route.js`**: Progress tracking (GET, PUT)
- **`src/app/api/certificates/route.js`**: Certificate generation and listing
- **`src/app/api/admin/learning-stats/route.js`**: Admin statistics

### Frontend Components

#### Admin Pages
- **`src/app/dashboard/admin/courses/page.jsx`**: Course management interface
  - Create/Edit/Delete courses
  - View all courses with stats
  - Toggle active/inactive status
  - Course thumbnail upload

#### Candidate Pages
- **`src/app/dashboard/candidate/learning/page.jsx`**: Learning dashboard
  - View enrolled courses
  - Discover new courses
  - Track progress
  - View certificates

- **`src/app/dashboard/candidate/learning/[id]/page.jsx`**: Course detail page
  - Lesson viewer
  - Progress tracking
  - Certificate download
  - Mark lessons as complete

#### Updated Components
- **`src/app/dashboard/components/Sidebar.jsx`**: Added Learning Management navigation

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

New dependencies added:
- `jspdf`: PDF generation for certificates
- `html2canvas`: Canvas rendering (for future certificate visual enhancements)

### 2. Database Setup

The system uses MongoDB collections:
- `courses`: Stores course information
- `course-progress`: Tracks user progress
- `certificates`: Stores certificate data

### 3. Environment Variables

Ensure your `.env.local` includes:
```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📋 Usage Guide

### For Admins

#### Creating a Course
1. Navigate to Dashboard → Course Management
2. Click "Create Course" button
3. Fill in:
   - Title and description
   - Category (Web Development, Data Science, etc.)
   - Level (Beginner, Intermediate, Advanced)
   - Duration in hours
   - Thumbnail URL
   - Price (0 for free courses)
4. Click "Create Course"

#### Adding Lessons
1. Edit the course
2. Add lessons in the lessons array with:
   - Title
   - Description
   - Content (URL or text)
   - Content Type (video, pdf, text, quiz, link)
   - Duration in minutes
   - Order

#### Viewing Statistics
1. Go to Admin Dashboard
2. View stats:
   - Total courses
   - Active learners
   - Certificates issued
   - Average completion rate
   - Top enrolled courses

### For Candidates

#### Enrolling in a Course
1. Go to Dashboard → My Learning
2. Browse courses or view recommended
3. Click "Enroll Now"
4. Course is added to "My Courses"

#### Taking a Course
1. Click on enrolled course
2. View lessons in sidebar
3. Watch/read content
4. Click "Mark as Complete" for each lesson
5. Track progress with visual progress bar

#### Getting a Certificate
1. Complete all lessons (100% progress)
2. Click "Download Certificate" button
3. Certificate PDF is generated with:
   - Your name
   - Course title
   - Date of issue
   - Unique certificate ID
   - Verification URL

## 🎨 Design Features

### Color Palette
- Primary: Blue (#3b82f6) - Trust and professionalism
- Success: Green - Completion and achievements
- Warning: Orange - In progress indicators
- Info: Blue - Informational content

### UI Elements
- **Progress Bars**: Visual representation of course completion
- **Badges**: Course level, category, enrollment status
- **Cards**: Clean card-based layout for courses
- **Icons**: Lucide React icons for consistency
- **Responsive**: Mobile-first responsive design

## 🔐 Security Features

- **Role-based Access**: Admin and Candidate role separation
- **Session Validation**: All API routes validate user session
- **Certificate Verification**: Unique certificate IDs prevent forgery
- **Progress Protection**: Users can only track their own progress

## 📊 Data Models

### Course Model
```javascript
{
  title: String,
  description: String,
  category: String,
  level: String,
  duration: Number,
  thumbnail: String,
  lessons: Array,
  enrolledStudents: Number,
  rating: Number,
  isActive: Boolean,
  isFeatured: Boolean
}
```

### Progress Model
```javascript
{
  userId: String,
  courseId: ObjectId,
  completedLessons: Array,
  totalLessons: Number,
  progressPercent: Number,
  isCompleted: Boolean,
  certificateIssued: Boolean,
  certificateId: String
}
```

### Certificate Model
```javascript
{
  certificateId: String (unique),
  userId: String,
  courseId: ObjectId,
  courseTitle: String,
  issuedAt: Date,
  verificationUrl: String,
  isVerified: Boolean
}
```

## 🛠️ API Endpoints

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses?id=xxx` - Get specific course
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/[id]` - Update course (Admin only)
- `DELETE /api/courses/[id]` - Delete course (Admin only)

### Enrollment
- `POST /api/courses/enroll` - Enroll in a course

### Progress
- `GET /api/courses/progress` - Get user progress
- `GET /api/courses/progress?courseId=xxx` - Get specific course progress
- `PUT /api/courses/progress` - Update progress (mark lesson complete)

### Certificates
- `GET /api/certificates` - Get user certificates
- `POST /api/certificates` - Generate certificate

### Admin
- `GET /api/admin/learning-stats` - Get learning statistics (Admin only)

## 🎓 Best Practices

### Course Creation
- Add clear, descriptive titles
- Include short descriptions for quick understanding
- Set appropriate difficulty levels
- Add high-quality thumbnails
- Structure lessons in logical order
- Include time estimates

### Progress Tracking
- Progress is automatically updated when lessons are completed
- Progress percentage calculated: (completed / total) * 100
- Certificates can only be generated at 100% completion

### Certificate Generation
- Certificates are PDF files
- Include unique IDs for verification
- Automatically generated upon completion
- Download link provided immediately

## 🔄 Future Enhancements

- [ ] Video progress tracking (resume from last position)
- [ ] Quiz assessments with grades
- [ ] Course ratings and reviews
- [ ] Discussion forums per course
- [ ] Email notifications for course completion
- [ ] Scheduled course start dates
- [ ] Course prerequisites
- [ ] Badge system for achievements
- [ ] Social sharing of certificates
- [ ] Video upload and hosting integration

## 📝 Notes

- The certificate generation uses client-side jsPDF to avoid server load
- All course content should be externally hosted (videos, PDFs)
- Progress is stored in real-time in MongoDB
- Certificates are generated on-demand when user completes course
- Admin can view all learner statistics from dashboard

## 🤝 Contributing

To add new features:
1. Update models if needed
2. Create API routes following existing patterns
3. Add frontend components in appropriate dashboard folders
4. Update Sidebar navigation
5. Test with different user roles

## 📄 License

Part of CareerOstad platform - All rights reserved.

