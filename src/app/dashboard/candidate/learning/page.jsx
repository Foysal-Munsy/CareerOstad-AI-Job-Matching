"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaBook, FaClock, FaUsers, FaStar, FaLock, FaCheckCircle } from 'react-icons/fa';

export default function CandidateLearningPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    inProgress: 0,
    certificates: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        fetch('/api/courses?isActive=true'),
        fetch('/api/courses/progress')
      ]);
      
      const [coursesData, progressData] = await Promise.all([
        coursesRes.json(),
        progressRes.json()
      ]);
      
      if (coursesData.success) {
        setCourses(coursesData.courses);
        const enrolled = coursesData.courses.filter(c => 
          progressData.progress?.some(p => p.courseId === c._id)
        );
        setMyCourses(enrolled);
      }
      
      if (progressData.success) {
        const progList = progressData.progress;
        setProgress(progList);
        setStats({
          enrolled: progList.length,
          completed: progList.filter(p => p.isCompleted).length,
          inProgress: progList.filter(p => !p.isCompleted && p.progressPercent > 0).length,
          certificates: progList.filter(p => p.certificateIssued).length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = activeTab === 'my-courses'
    ? myCourses
    : activeTab === 'recommended'
    ? courses.filter(c => c.isFeatured)
    : courses;

  const getProgressPercent = (courseId) => {
    const prog = progress.find(p => p.courseId === courseId);
    return prog?.progressPercent || 0;
  };

  const isEnrolled = (courseId) => {
    return progress.some(p => p.courseId === courseId);
  };

  const enrollInCourse = async (courseId) => {
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });
      
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Learning Dashboard</h1>
        <p className="text-base-content/60 mt-1">Learn new skills and advance your career</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-xl w-12">
                  <FaBook className="text-xl" />
                </div>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Enrolled</p>
                <p className="text-2xl font-bold">{stats.enrolled}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-success text-success-content rounded-xl w-12">
                  <FaCheckCircle className="text-xl" />
                </div>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-warning text-warning-content rounded-xl w-12">
                  <FaClock className="text-xl" />
                </div>
              </div>
              <div>
                <p className="text-sm text-base-content/60">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-info text-info-content rounded-xl w-12">
                  <FaStar className="text-xl" />
                </div>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Certificates</p>
                <p className="text-2xl font-bold">{stats.certificates}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          onClick={() => setActiveTab('all')}
          className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
        >
          All Courses
        </button>
        <button
          onClick={() => setActiveTab('my-courses')}
          className={`tab ${activeTab === 'my-courses' ? 'tab-active' : ''}`}
        >
          My Courses
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`tab ${activeTab === 'recommended' ? 'tab-active' : ''}`}
        >
          Recommended for You
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const prog = getProgressPercent(course._id);
          const enrolled = isEnrolled(course._id);
          
          return (
            <div key={course._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              {course.thumbnail && (
                <figure className="relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                  {course.price === 0 && (
                    <div className="absolute top-2 right-2 badge badge-success">FREE</div>
                  )}
                  {course.isFeatured && (
                    <div className="absolute top-2 left-2 badge badge-primary">FEATURED</div>
                  )}
                </figure>
              )}
              
              <div className="card-body">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="card-title text-lg">{course.title}</h2>
                  {enrolled && (
                    <span className="badge badge-success badge-sm">
                      Enrolled
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {course.shortDescription || course.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="badge badge-ghost">{course.level}</span>
                  <span className="badge badge-ghost">{course.category}</span>
                </div>
                
                {enrolled && prog > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{prog}%</span>
                    </div>
                    <progress className="progress progress-primary" value={prog} max="100"></progress>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 text-sm text-base-content/60">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaClock /> {course.duration}h
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUsers /> {course.enrolledStudents || 0}
                    </span>
                  </div>
                  {course.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <FaStar className="text-warning" /> {course.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                
                <div className="card-actions mt-4">
                  {enrolled ? (
                    <Link 
                      href={`/dashboard/candidate/learning/${course._id}`}
                      className="btn btn-primary btn-block"
                    >
                      {prog === 100 ? 'View Certificate' : 'Continue Learning'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => enrollInCourse(course._id)}
                      className="btn btn-outline btn-primary btn-block"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <FaBook className="text-6xl text-base-content/30 mx-auto mb-4" />
          <p className="text-lg text-base-content/60">No courses available</p>
        </div>
      )}
    </div>
  );
}

