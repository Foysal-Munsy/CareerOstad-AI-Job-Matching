"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaCheckCircle, FaClock, FaUsers, FaStar, FaPlay, 
  FaFilePdf, FaLink, FaCertificate, FaArrowLeft, 
  FaBook, FaUser, FaDownload 
} from 'react-icons/fa';

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const courseId = params.id;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      if (session) {
        checkEnrollment();
      }
    }
  }, [courseId, session]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.success) {
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await fetch(`/api/courses/progress?courseId=${courseId}`);
      const data = await res.json();
      if (data.success && data.progress.length > 0) {
        setEnrolled(true);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });
      
      if (res.ok) {
        setEnrolled(true);
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
        <div className="text-center">
          <FaBook className="text-6xl text-base-content/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-base-content/60 mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/learning" className="btn btn-primary">
            <FaArrowLeft /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/learning" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <FaArrowLeft /> Back to Courses
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <div className="card bg-base-100 shadow-xl">
              {course.thumbnail && (
                <figure>
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-80 object-cover"
                  />
                </figure>
              )}
              
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge badge-primary">{course.level}</span>
                  <span className="badge badge-secondary">{course.category}</span>
                  {course.isFeatured && (
                    <span className="badge badge-accent">FEATURED</span>
                  )}
                  {course.price === 0 && (
                    <span className="badge badge-success">FREE</span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-primary mb-4">{course.title}</h1>
                
                <div className="flex items-center gap-6 text-base-content/60 mb-4">
                  <div className="flex items-center gap-2">
                    <FaClock /> {course.duration} hours
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers /> {course.enrolledStudents || 0} students
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <FaStar className="text-warning" /> {course.rating.toFixed(1)} ({course.totalRatings || 0})
                    </div>
                  )}
                </div>

                <p className="text-lg mb-4">{course.description}</p>

                <div className="divider"></div>

                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {course.tags?.slice(0, 8).map((tag, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCheckCircle className="text-success" />
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Course Content */}
            {course.lessons && course.lessons.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    Course Curriculum
                    <span className="text-base-content/60 font-normal ml-2">
                      ({course.lessons.length} lessons)
                    </span>
                  </h2>
                  
                  <div className="space-y-2">
                    {course.lessons.map((lesson, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-base-content/60">{lesson.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-base-content/60">
                          {lesson.contentType === 'video' && <FaPlay />}
                          {lesson.contentType === 'pdf' && <FaFilePdf />}
                          {lesson.contentType === 'link' && <FaLink />}
                          <span>{lesson.duration || 0} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Instructor */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Your Instructor</h2>
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-16">
                      <FaUser className="text-2xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{course.instructorName}</h3>
                    <p className="text-base-content/60">Expert Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-4">
              <div className="card-body">
                <div className="text-3xl font-bold mb-4">
                  {course.price === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    `$${course.price}`
                  )}
                </div>

                {!session ? (
                  <div className="space-y-3">
                    <Link href="/login" className="btn btn-primary btn-block">
                      Login to Enroll
                    </Link>
                    <Link href="/signup" className="btn btn-outline btn-primary btn-block">
                      Sign Up Free
                    </Link>
                  </div>
                ) : enrolled ? (
                  <Link 
                    href={`/dashboard/candidate/learning/${courseId}`}
                    className="btn btn-success btn-block gap-2"
                  >
                    <FaCheckCircle /> Start Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn btn-primary btn-block gap-2"
                  >
                    {enrolling ? 'Enrolling...' : (
                      <>
                        <FaDownload /> Enroll Now
                      </>
                    )}
                  </button>
                )}

                <div className="divider"></div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Duration</span>
                    <span className="font-semibold">{course.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Level</span>
                    <span className="font-semibold">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Category</span>
                    <span className="font-semibold">{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Students</span>
                    <span className="font-semibold">{course.enrolledStudents || 0}</span>
                  </div>
                  {course.rating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-base-content/60">Rating</span>
                      <span className="font-semibold">
                        <FaStar className="text-warning inline" /> {course.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="divider"></div>

                <div className="flex flex-col gap-2">
                  <button className="btn btn-ghost btn-block">
                    <FaCertificate className="mr-2" />
                    Share Certificate
                  </button>
                  <button className="btn btn-ghost btn-block">
                    <FaDownload className="mr-2" />
                    Download Resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

