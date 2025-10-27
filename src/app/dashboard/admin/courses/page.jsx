"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FaPlus, FaEdit, FaTrash, FaBook, FaClock, FaUsers, 
  FaStar, FaCheckCircle, FaTimesCircle 
} from 'react-icons/fa';

export default function AdminCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed modal-related state since we're using separate pages now

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Removed handleSubmit since we're using separate pages now

  const handleEdit = (course) => {
    // Navigate to edit page instead of opening modal
    window.location.href = `/dashboard/admin/courses/edit/${course._id}`;
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Removed resetForm since we're using separate pages now

  const toggleStatus = async (course) => {
    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !course.isActive })
      });
      if (res.ok) await fetchCourses();
    } catch (error) {
      console.error('Error toggling course status:', error);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Course Management</h1>
          <p className="text-base-content/60 mt-1">Manage learning courses and content</p>
        </div>
        <Link href="/dashboard/admin/courses/create" className="btn btn-primary gap-2">
          <FaPlus /> Create Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <FaBook className="text-3xl text-primary" />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Active Courses</p>
                <p className="text-2xl font-bold">
                  {courses.filter(c => c.isActive).length}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-success" />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Enrollments</p>
                <p className="text-2xl font-bold">
                  {courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)}
                </p>
              </div>
              <FaUsers className="text-3xl text-info" />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Average Rating</p>
                <p className="text-2xl font-bold">
                  {courses.length > 0
                    ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <FaStar className="text-3xl text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            {course.thumbnail && (
              <figure>
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
              </figure>
            )}
            <div className="card-body">
              <div className="flex items-start justify-between mb-2">
                <h2 className="card-title text-lg">{course.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="btn btn-sm btn-ghost"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="btn btn-sm btn-ghost text-error"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-sm text-base-content/70 line-clamp-2">{course.shortDescription || course.description}</p>
              
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span className="badge badge-primary">{course.level}</span>
                <span className="badge badge-secondary">{course.category}</span>
                <span className="flex items-center gap-1">
                  <FaClock /> {course.duration}h
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-base-content/60" />
                  <span className="text-sm">{course.enrolledStudents || 0} students</span>
                </div>
                <button
                  onClick={() => toggleStatus(course)}
                  className={`btn btn-sm ${course.isActive ? 'btn-success' : 'btn-error'}`}
                >
                  {course.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                  {course.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal removed - using separate pages now */}
    </div>
  );
}

