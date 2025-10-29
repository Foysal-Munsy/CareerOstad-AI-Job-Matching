'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaBook,
  FaClock,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaSearch,
  FaCertificate,
} from 'react-icons/fa';

export default function CandidateLearningPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('my-courses');
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    inProgress: 0,
    certificates: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        fetch('/api/courses?isActive=true'),
        fetch('/api/courses/progress'),
      ]);

      const [coursesData, progressData] = await Promise.all([
        coursesRes.json(),
        progressRes.json(),
      ]);

      if (coursesData.success) {
        setCourses(coursesData.courses);
        const enrolledCourses = coursesData.courses.filter((c) =>
          progressData.progress?.some((p) => p.courseId === c._id)
        );
        setMyCourses(enrolledCourses);
      }

      if (progressData.success) {
        const progList = progressData.progress;
        setProgress(progList);
        setStats({
          enrolled: progList.length,
          completed: progList.filter((p) => p.isCompleted).length,
          inProgress: progList.filter(
            (p) => !p.isCompleted && p.progressPercent > 0
          ).length,
          certificates: progList.filter((p) => p.certificateIssued).length,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const baseCourses =
    activeTab === 'my-courses'
      ? myCourses
      : activeTab === 'recommended'
      ? courses.filter((c) => c.isFeatured)
      : courses;

  const filteredCourses = baseCourses.filter((c) => {
    const matchesSearch =
      search.trim().length === 0 ||
      (c.title || '').toLowerCase().includes(search.toLowerCase());
    const matchesLevel =
      levelFilter === 'all' ||
      (c.level || '').toLowerCase() === levelFilter.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  const getProgressPercent = (courseId) => {
    const prog = progress.find((p) => p.courseId === courseId);
    return prog?.progressPercent || 0;
  };

  const isEnrolled = (courseId) => progress.some((p) => p.courseId === courseId);

  const enrollInCourse = async (courseId) => {
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) await fetchData();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  // Loading state skeleton
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-64 bg-base-300/50 rounded-lg animate-pulse" />
          <div className="h-4 w-80 bg-base-300/40 rounded mt-2 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-md p-4 animate-pulse">
              <div className="h-10 w-32 bg-base-300/50 rounded mb-3" />
              <div className="h-4 w-24 bg-base-300/40 rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-md animate-pulse">
              <div className="w-full h-48 bg-base-300/50 rounded-t-lg" />
              <div className="card-body">
                <div className="h-6 w-3/4 bg-base-300/40 rounded mb-2" />
                <div className="h-4 w-full bg-base-300/30 rounded mb-2" />
                <div className="h-4 w-2/3 bg-base-300/30 rounded mb-4" />
                <div className="h-10 w-full bg-base-300/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Learning Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            Continue your learning journey and earn certificates
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="join w-full sm:w-72">
            <div className="join-item input input-bordered input-sm flex items-center gap-2 w-full">
              <FaSearch className="w-4 h-4 text-base-content/60 flex-shrink-0" />
              <input
                className="grow bg-transparent outline-none"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="join-item select select-bordered select-sm"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <Link
            href="/dashboard/candidate/certificates"
            className="btn btn-sm btn-outline gap-2"
          >
            <FaCertificate className="w-4 h-4" />
            Certificates
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled', value: stats.enrolled, icon: FaBook, color: 'primary' },
          {
            label: 'Completed',
            value: stats.completed,
            icon: FaCheckCircle,
            color: 'success',
          },
          {
            label: 'In Progress',
            value: stats.inProgress,
            icon: FaClock,
            color: 'warning',
          },
          {
            label: 'Certificates',
            value: stats.certificates,
            icon: FaCertificate,
            color: 'info',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card bg-base-100 shadow-lg">
            <div className="card-body flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-${color}-content bg-${color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-base-content/60">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed w-full overflow-x-auto">
        {[
          { key: 'all', label: 'All Courses' },
          { key: 'my-courses', label: 'My Courses' },
          { key: 'recommended', label: 'Recommended' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`tab ${activeTab === key ? 'tab-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const prog = getProgressPercent(course._id);
            const enrolled = isEnrolled(course._id);

            return (
              <div
                key={course._id}
                className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <figure className="relative">
                  <div className="w-full aspect-[16/9] bg-base-200 overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/40">
                        <FaBook className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {course.price === 0 && (
                    <div className="absolute top-2 right-2 badge badge-success">
                      FREE
                    </div>
                  )}
                  {course.isFeatured && (
                    <div className="absolute top-2 left-2 badge badge-primary">
                      FEATURED
                    </div>
                  )}
                </figure>

                <div className="card-body">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="card-title text-lg">{course.title}</h2>
                    {enrolled && (
                      <span className="badge badge-success badge-sm">Enrolled</span>
                    )}
                  </div>

                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {course.shortDescription || course.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                    {course.level && (
                      <span className="badge badge-ghost">{course.level}</span>
                    )}
                    {course.category && (
                      <span className="badge badge-ghost">{course.category}</span>
                    )}
                  </div>

                  {enrolled && prog > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{prog}%</span>
                      </div>
                      <progress
                        className="progress progress-primary"
                        value={prog}
                        max="100"
                      ></progress>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 text-sm text-base-content/60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <FaClock className="w-4 h-4" /> {course.duration || 0}h
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaUsers className="w-4 h-4" />{' '}
                        {course.enrolledStudents || 0}
                      </span>
                    </div>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1.5">
                        <FaStar className="w-4 h-4 text-warning" />{' '}
                        {course.rating.toFixed(1)}
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
      ) : (
        <div className="text-center py-16">
          <FaBook className="text-6xl text-base-content/30 mx-auto mb-4" />
          <p className="text-lg text-base-content/60">No courses available</p>
        </div>
      )}
    </div>
  );
}
