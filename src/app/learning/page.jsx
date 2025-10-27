"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaBook, FaClock, FaUsers, FaStar, FaPlay, FaCheckCircle, FaLock } from 'react-icons/fa';

export default function LearningPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [selectedCategory, selectedLevel, courses]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses?isActive=true');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        setFilteredCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }
    
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(c => c.level === selectedLevel);
    }
    
    setFilteredCourses(filtered);
  };

  const categories = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'UI/UX Design', 'Digital Marketing', 'Business Analysis', 'Project Management'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-primary mb-4">
              Learn & Grow with CareerOstad
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              Discover courses tailored to your career path and advance your skills
            </p>
            {!session && (
              <div className="flex gap-4 justify-center">
                <Link href="/login" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link href="/signup" className="btn btn-outline btn-primary btn-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Filter Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Level</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {filteredCourses.length} Courses Available
          </h2>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <FaBook className="text-6xl text-base-content/30 mx-auto mb-4" />
              <p className="text-lg text-base-content/60">No courses found matching your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
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
                    <h2 className="card-title text-lg">{course.title}</h2>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {course.shortDescription || course.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="badge badge-ghost">{course.level}</span>
                      <span className="badge badge-ghost">{course.category}</span>
                    </div>
                    
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
                      <Link 
                        href={`/learning/${course._id}`}
                        className="btn btn-primary btn-block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!session && (
          <div className="card bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-2xl mb-8">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-3xl mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg mb-6">
                Join thousands of students advancing their careers with CareerOstad
              </p>
              <div className="card-actions justify-center">
                <Link href="/signup" className="btn btn-lg bg-base-100 text-primary hover:bg-base-200">
                  Create Free Account
                </Link>
                <Link href="/login" className="btn btn-lg btn-outline bg-transparent border-base-100 text-base-100 hover:bg-base-100 hover:text-primary">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

