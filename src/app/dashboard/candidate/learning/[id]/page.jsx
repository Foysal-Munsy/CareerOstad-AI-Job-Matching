"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { FaCheckCircle, FaClock, FaPlay, FaFilePdf, FaLink, FaCertificate, FaLock } from 'react-icons/fa';
import jsPDF from 'jspdf';

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const courseId = params.id;
  
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/progress?courseId=${courseId}`)
      ]);
      
      const courseData = await courseRes.json();
      const progressData = await progressRes.json();
      
      if (courseData.success) {
        setCourse(courseData.course);
      }
      
      if (progressData.success && progressData.progress.length > 0) {
        setProgress(progressData.progress[0]);
      } else {
        // Not enrolled yet
        setProgress(null);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async () => {
    setEnrolling(true);
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });
      
      if (res.ok) {
        await fetchCourseDetails();
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const markLessonComplete = async (lessonOrder) => {
    try {
      const res = await fetch('/api/courses/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonOrder
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const generateCertificate = async () => {
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });
      
      const data = await res.json();
      if (data.success && data.certificate) {
        downloadCertificate(data.certificate);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const downloadCertificate = (certificate) => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    
    // Background
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, width, height, 'F');
    
    // Border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(5);
    doc.rect(10, 10, width - 20, height - 20);
    
    // Header
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificate of Completion', width / 2, 40, { align: 'center' });
    
    // Body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', width / 2, 70, { align: 'center' });
    
    // Name
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(certificate.userName, width / 2, 95, { align: 'center' });
    
    // Course details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the course', width / 2, 115, { align: 'center' });
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(certificate.courseTitle, width / 2, 135, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Issued on: ${new Date(certificate.issuedAt).toLocaleDateString()}`, width / 2, 160, { align: 'center' });
    
    // Certificate ID
    doc.text(`Certificate ID: ${certificate.certificateId}`, width / 2, 175, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This certificate is verifiable at careerostad.com', width / 2, height - 30, { align: 'center' });
    
    doc.save(`certificate-${certificate.certificateId}.pdf`);
  };

  const isLessonCompleted = (lessonOrder) => {
    if (!progress) return false;
    return progress.completedLessons.some(l => l.lessonOrder === lessonOrder);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-base-content/60">Course not found</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="space-y-6">
        <div className="card bg-base-100 shadow-lg">
          {course.thumbnail && (
            <figure>
              <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover" />
            </figure>
          )}
          <div className="card-body">
            <h1 className="card-title text-3xl">{course.title}</h1>
            <p className="text-base-content/70">{course.description}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm">
              <span className="badge badge-primary">{course.level}</span>
              <span className="badge badge-secondary">{course.category}</span>
              <span className="flex items-center gap-1">
                <FaClock /> {course.duration} hours
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="text-lg font-bold">
                {course.price === 0 ? 'FREE' : `$${course.price}`}
              </div>
              <button
                onClick={enrollInCourse}
                disabled={enrolling}
                className="btn btn-primary btn-lg"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
        
        {course.lessons && course.lessons.length > 0 && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-4">Course Curriculum</h2>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-base-300 rounded-lg">
                    <FaLock className="text-base-content/40" />
                    <span className="flex-1">{lesson.title}</span>
                    <span className="text-sm text-base-content/60">{lesson.duration || 0} min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentLesson = course.lessons[selectedLesson];
  const progressPercent = progress.progressPercent || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="card bg-base-100 shadow-lg sticky top-4">
          <div className="card-body">
            <h2 className="card-title">Course Content</h2>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span className="font-bold">{progressPercent}%</span>
              </div>
              <progress className="progress progress-primary w-full" value={progressPercent} max="100"></progress>
            </div>
            
            {/* Lessons */}
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {course.lessons.map((lesson, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedLesson(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedLesson === index 
                      ? 'border-primary bg-primary/10' 
                      : 'border-base-300 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isLessonCompleted(index) ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaPlay className="text-base-content/40" />
                    )}
                    <span className="flex-1 text-sm">{lesson.title}</span>
                    {lesson.duration && (
                      <span className="text-xs text-base-content/60">
                        {lesson.duration}min
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {progressPercent === 100 && !progress.certificateIssued && (
              <div className="mt-4">
                <button
                  onClick={generateCertificate}
                  className="btn btn-success btn-block gap-2"
                >
                  <FaCertificate /> Download Certificate
                </button>
              </div>
            )}
            
            {progress.certificateIssued && (
              <div className="mt-4">
                <div className="alert alert-success">
                  <FaCheckCircle /> Certificate Earned!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            {!isLessonCompleted(selectedLesson) && (
              <div className="mb-4">
                <button
                  onClick={() => markLessonComplete(selectedLesson)}
                  className="btn btn-primary gap-2"
                >
                  <FaCheckCircle /> Mark as Complete
                </button>
              </div>
            )}
            
            <h1 className="text-2xl font-bold mb-4">{currentLesson?.title}</h1>
            
            {currentLesson?.description && (
              <p className="text-base-content/70 mb-4">{currentLesson.description}</p>
            )}
            
            <div className="space-y-4">
              {currentLesson?.contentType === 'video' && (
                <div className="aspect-video">
                  <iframe
                    src={currentLesson.content}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              {currentLesson?.contentType === 'text' && (
                <div className="prose max-w-none">
                  <p>{currentLesson.content}</p>
                </div>
              )}
              
              {currentLesson?.contentType === 'pdf' && (
                <div className="border border-base-300 rounded-lg p-4">
                  <a
                    href={currentLesson.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline gap-2"
                  >
                    <FaFilePdf /> View PDF Document
                  </a>
                </div>
              )}
              
              {currentLesson?.contentType === 'link' && (
                <div className="border border-base-300 rounded-lg p-4">
                  <a
                    href={currentLesson.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline gap-2"
                  >
                    <FaLink /> Open Resource
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

