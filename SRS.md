## Software Requirements Specification (SRS)

### 1. Introduction

- **Product name**: CareerOstad – AI Job Matching and Learning Platform
- **Document purpose**: Define functional and non-functional requirements, scope, and constraints to guide design, implementation, testing, and acceptance of the platform.
- **Intended audience**: Product owners, developers, QA engineers, DevOps, security reviewers, and stakeholders.
- **Scope**: A web platform that matches candidates to jobs using AI, enables companies to manage postings and evaluate candidates, supports learning content and progress tracking, provides career advice, and includes verification and payments.

### 2. System Overview

- **Platform**: Next.js app with API routes, server-side rendering, and client components.
- **Core modules**:
  - Authentication and user management (NextAuth)
  - Job listings, recommendations, matching, and applications
  - Candidate profiles and resumes (upload and AI-generated resume/cover letters)
  - Company dashboards and candidate evaluation (including AI interview tools)
  - Learning content (courses), enrollment, progress tracking, and certificates
  - Career advice and career exploration tools
  - Notifications and messaging
  - Admin dashboard for content and user management
  - Payments and verification flows
- **Primary users**: Candidate, Company (Employer/Recruiter), Admin.

### 3. Definitions and Acronyms

- **AI Matching**: Automated evaluation aligning candidate profiles with job requirements.
- **SSR**: Server-Side Rendering.
- **NFR**: Non-Functional Requirement.
- **PII**: Personally Identifiable Information.

### 4. Stakeholders and User Roles

- **Candidate**: Creates profile, uploads resume, applies to jobs, completes career quizzes, enrolls in courses, tracks progress, receives recommendations and notifications.
- **Company**: Creates company profile, posts jobs, views matches, reviews applications, evaluates candidates, communicates with candidates.
- **Admin**: Manages blogs, categories, users, jobs, courses, notifications, platform settings, monitors reports and analytics.

### 5. Assumptions and Dependencies

- Users have internet access and a modern browser.
- Node.js environment with Next.js 13+ App Router.
- MongoDB (via Mongoose) for persistence.
- NextAuth for auth, Cloudinary for media, Stripe for payments (intent APIs present), WebSockets for realtime.
- Third-party LLM/AI services may be used for generation and evaluation (where routes indicate AI features).

### 6. High-Level Architecture

- **Frontend**: Next.js App Router under `src/app`, server and client components, global styles in `src/app/globals.css`.
- **Backend**: Next.js API routes under `src/app/api/**` handling auth, jobs, matching, career tools, courses, profile, messaging, admin, verification, and uploads.
- **Database**: Mongoose models in `src/models` (`Job`, `JobCategory`, `Course`, `CourseProgress`, `Certificate`).
- **Auth**: `src/lib/authOptions.js` with NextAuth provider configuration.
- **Realtime**: `src/lib/socket.js` and `server.js` for socket server.
- **Media**: `src/lib/cloudinary.js` for uploads.
- **Payments**: `src/app/api/create-payment-intent/route.js` and verification-related endpoints.

### 7. Functional Requirements

#### 7.1 Authentication and Authorization
- Users can register and log in (credentials, OAuth if configured).
- Password reset via `forgot-password` route.
- Session management and protected routes enforced via middleware.
- Roles: Candidate, Company, Admin. Access control enforced on admin and company endpoints.

#### 7.2 User Profile (Candidate)
- Create and update profile, upload avatar and resume (`profile/upload-*`).
- Public profile viewing with limited fields (`api/public/profile`).
- Receive notifications and messages.

#### 7.3 Company Profile
- Create and update company profile.
- View candidate profiles relevant to posted jobs.
- Company-specific stats and analytics.

#### 7.4 Jobs and Applications
- Admin or Companies can create, update, and list jobs (`api/jobs` and admin job management).
- Candidates can search, view, save jobs, and apply (`api/applications`).
- System provides recommended jobs and detailed match scoring (`api/jobs/recommended`, `api/jobs/match`, `api/jobs/detailed-match`).
- Companies can view applications per job and match candidates (`api/company/applications`, `api/match-candidate`).

#### 7.5 AI Assistance
- Generate resumes and cover letters (`api/resume/generate`, `api/cover-letter/generate`).
- Interview generation and AI evaluation (`api/interview/generate`, `api/interview/evaluate`).
- Career quiz and recommendations (`api/career-quiz`, `api/career-recommendations`, `api/career-roadmap`).
- Skill matching support (`api/match-skill`).

#### 7.6 Learning and Certificates
- Browse courses, enroll, track progress (`api/courses/*`).
- Generate and manage certificates (`api/certificates`).

#### 7.7 Career Advice and Blogs
- Career advice listing and details pages (`src/app/career-advice`, `src/app/advice`).
- Admin can manage blog posts and categories (`api/admin/blogs`, `api/admin/categories`).

#### 7.8 Notifications and Messaging
- Users receive notifications (`api/notifications`).
- Messaging between parties (`api/messages`).
- Real-time updates via WebSockets for chat/notifications.

#### 7.9 Payments and Verification
- Create payment intents for services (`api/create-payment-intent`).
- Verification flows including status and webhooks (`api/verification/*`).
- Display verified badges and handle purchase flows on UI.

#### 7.10 Admin Dashboard
- Manage users, roles, jobs, feature jobs, categories, courses, notifications, settings.
- View analytics and reports (`api/admin/*`).

### 8. Data Model (Conceptual)

- **User**: id, role, name, email, password hash or provider id, avatar, resume, profile data, notifications.
- **Company**: id, owner user id, company details, verification status, jobs posted, stats.
- **Job**: id, title, description, requirements, skills, category, location, salary range, company id, status, createdAt, updatedAt.
- **JobCategory**: id, name, description.
- **Application**: id, job id, candidate id, resume link, cover letter, status, match score, timestamps.
- **Course**: id, title, description, thumbnail, syllabus, price, category, published, createdAt.
- **CourseProgress**: id, user id, course id, progress %, milestones, updatedAt.
- **Certificate**: id, user id, course id, issuedAt, certificate code/url.
- **Notification**: id, user id, type, payload, read status, createdAt.
- **Message**: id, sender id, receiver id or thread id, body, attachments, timestamps.
- **PaymentIntent/Verification**: id, user id, service, amount, currency, status, provider refs, timestamps.

### 9. Key Pages and Flows (UI)

- Public: Home, Explore Careers, Jobs list and detail, Career Advice, Blogs, Search, Terms.
- Auth: Login, Signup, Forgot Password, Verification Success.
- Candidate Dashboard: Overview, Applications, Saved Jobs, Profile, Learning, Certificates, Settings.
- Company Dashboard: Jobs, Candidates, Matches, Applications, Company Profile, Analytics.
- Admin Dashboard: Users, Roles, Jobs, Categories, Courses, Blogs, Notifications, Feature Jobs, Reports, Settings.

### 10. API Endpoints (Overview)

- `api/auth/*`: NextAuth, forgot-password.
- `api/jobs/*`: CRUD, recommended, match, detailed-match, by id.
- `api/applications/*`: create/list candidate applications.
- `api/profile/*`: candidate/company profile, upload avatar/resume.
- `api/company/*`: candidate-profile, applications, stats.
- `api/career*`: quiz, roadmap, recommendations.
- `api/courses/*`: list, enroll, progress, by id; uploads for course thumbnail.
- `api/certificates/*`: create/list.
- `api/interview/*`: generate, evaluate.
- `api/messages/*`, `api/notifications/*`.
- `api/admin/*`: blogs, categories, users, stats, settings, reports, feature-jobs, learning-stats.
- `api/create-payment-intent/*`, `api/verification/*` (manual-verify, status, webhook).

Note: Exact request/response schemas to be documented per handler during implementation.

### 11. Non-Functional Requirements (NFRs)

- **Performance**: P95 page loads < 2.5s on broadband; API P95 latency < 400ms for non-LLM endpoints; streaming where applicable for AI endpoints.
- **Scalability**: Horizontal scaling for Next.js server and database. WebSocket infrastructure supports thousands of concurrent connections.
- **Availability**: Target 99.5% uptime; graceful degradation if AI services unavailable.
- **Security**: OWASP ASVS L2 controls; session protection; CSRF on mutations; input validation; rate limiting on auth and generation endpoints; secure file upload and MIME validation; secrets management.
- **Privacy**: Comply with GDPR principles; minimize PII storage; allow profile visibility controls; data export/delete upon request.
- **Reliability**: Idempotent webhooks; retry strategies; durable storage of critical events.
- **Observability**: Structured logging, request tracing, basic metrics (RPS, latency, error rates), alerting thresholds.
- **Compatibility**: Modern evergreen browsers; responsive design for mobile and desktop.
- **Maintainability**: Linted, typed where possible, modular architecture, API contracts documented.

### 12. Constraints

- Hosted on a Node.js runtime compatible with Next.js App Router.
- MongoDB as primary database.
- Third-party costs for AI, storage, and payments.

### 13. Error Handling and Validation

- Uniform error response format with error codes and messages.
- Input validation on API layer; schema validation for complex payloads.
- User-friendly error messages on UI; retries on transient network errors.

### 14. Security Requirements

- Password hashing with a strong algorithm; OAuth tokens securely stored.
- Access control checks on all protected routes; role-based authorization.
- File uploads scanned/validated, stored via Cloudinary with signed URLs.
- Payment data handled only via provider SDKs; no card storage on platform.
- Webhook signatures verified; replay protection.

### 15. AI/ML Requirements

- Explainability: Provide rationale snippets for match scores where feasible.
- Safety: Filter prompts/outputs for harmful content; cap generation token limits.
- Cost control: Enforce rate limits and quota per user/company on AI endpoints.

### 16. Acceptance Criteria (High-Level)

- Users can sign up, log in, reset password, and manage session reliably.
- Candidates can complete profile, upload resume, apply to jobs, receive recommendations.
- Companies can post jobs, view applicants, and see match scores.
- Admin can manage core entities (users, jobs, courses, blogs).
- Payments and verification complete end-to-end with webhook confirmation.
- Learning: enrollments, progress tracking, and certificate issuance function.
- Notifications and messaging deliver reliably; realtime updates are visible.

### 17. Testing Overview

- Unit tests for utilities and API handlers.
- Integration tests for critical flows (auth, apply, payment/verification, uploads).
- E2E smoke on top user journeys (candidate apply, company post, admin CRUD).
- Load tests for jobs listing and recommendation endpoints.

### 18. Deployment and Environments

- Environments: Development, Staging, Production.
- Env config via `.env` with separate secrets per environment.
- Build via Next.js; run `server.js` for socket if required by infra.
- Database migrations and indexes applied before deploy.

### 19. Documentation and Support

- API schemas documented inline and exported to a central spec as they stabilize.
- README contains setup, run, and contribution guidance.
- Admin and user guides to be authored post-MVP.

### 20. Future Enhancements

- Advanced analytics and dashboards for job performance and learning outcomes.
- Recommendation explainability UI and feedback loops.
- Multi-tenant organizations and seat-based billing.
- Mobile app shells via React Native or Expo Router.

---

Last updated: 2025-10-30
