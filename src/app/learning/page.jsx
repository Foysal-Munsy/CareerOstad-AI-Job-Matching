"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaBook, FaClock, FaUsers, FaStar, FaPlay, FaCheckCircle, FaLock, FaFilter, FaSearch } from 'react-icons/fa';

export default function LearningPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [selectedCategory, selectedLevel, searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
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
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredCourses(filtered);
  };

  const categories = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'UI/UX Design', 'Digital Marketing', 'Business Analysis', 'Project Management'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 py-8 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
              Learn & Grow with <span className="text-secondary">CareerOstad</span>
            </h1>
            <p className="text-base md:text-lg text-base-content/70 mb-6 max-w-2xl mx-auto leading-relaxed">
              Discover industry-relevant courses tailored to your career path and advance your skills with expert guidance
            </p>
            {!session && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login" className="btn btn-primary btn-md px-6 shadow hover:shadow-md transition-all">
                  Get Started Free
                </Link>
                <Link href="/signup" className="btn btn-outline btn-primary btn-md px-6 hover:bg-primary hover:text-primary-content transition-all">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="card bg-base-100 shadow-lg border border-base-300/50">
          <div className="card-body p-5">
            <div className="flex flex-col gap-5 md:grid md:grid-cols-12">
              {/* Search Bar */}
              <div className="flex-1 md:col-span-6 lg:col-span-7 min-w-0">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Search Courses</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by title, description, or category..."
                      className="input input-bordered input-md w-full pl-10 pr-3"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-base-content/40 text-base" />
                  </div>
                </div>
              </div>

              {/* Inline Filters for md+ */}
              <div className="hidden md:grid md:col-span-6 lg:col-span-5 md:grid-cols-2 md:gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Category</span>
                  </label>
                  <select
                    className="select select-bordered select-md w-full"
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
                    <span className="label-text font-semibold">Difficulty Level</span>
                  </label>
                  <select
                    className="select select-bordered select-md w-full"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Toggle for Mobile */}
              <div className="md:hidden">
                <button
                  className="btn btn-outline btn-md w-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter />
                  Filters
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:hidden transition-all duration-300`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 pt-5 border-t border-base-300/50">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Category</span>
                  </label>
                  <select
                    className="select select-bordered select-md"
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
                    <span className="label-text font-semibold">Difficulty Level</span>
                  </label>
                  <select
                    className="select select-bordered select-md"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery) && (
                  <>
                    {selectedCategory !== 'All' && (
                      <div className="badge badge-primary gap-2">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('All')}>×</button>
                      </div>
                    )}
                    {selectedLevel !== 'All' && (
                      <div className="badge badge-secondary gap-2">
                        {selectedLevel}
                        <button onClick={() => setSelectedLevel('All')}>×</button>
                      </div>
                    )}
                    {searchQuery && (
                      <div className="badge badge-accent gap-2">
                        "{searchQuery}"
                        <button onClick={() => setSearchQuery('')}>×</button>
                      </div>
                    )}
                    <button 
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedLevel('All');
                        setSearchQuery('');
                      }}
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 py-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-3">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Available
          </h2>
          <p className="text-base-content/60 text-base max-w-2xl mx-auto">
            Handpicked courses designed to boost your career and skills
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FaBook className="text-6xl text-base-content/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-base-content mb-3">No courses found</h3>
              <p className="text-base-content/60 mb-5 text-sm">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course._id} 
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-300/50 group"
              >
                {course.thumbnail && (
                  <figure className="relative overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {course.price === 0 && (
                        <div className="badge badge-success font-semibold shadow">FREE</div>
                      )}
                      {course.isFeatured && (
                        <div className="badge badge-primary font-semibold shadow">FEATURED</div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </figure>
                )}
                
                <div className="card-body p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="card-title text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h2>
                  </div>
                  
                  <p className="text-base-content/70 line-clamp-2 mb-3 leading-relaxed text-sm">
                    {course.shortDescription || course.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge badge-outline badge-primary text-xs">{course.level}</span>
                    <span className="badge badge-outline badge-secondary text-xs">{course.category}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs md:text-sm text-base-content/60 mb-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-primary/70 text-xs" /> 
                        {course.duration}h
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaUsers className="text-secondary/70 text-xs" /> 
                        {course.enrolledStudents || 0}
                      </span>
                    </div>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1.5 font-semibold">
                        <FaStar className="text-warning text-xs" /> 
                        {course.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="card-actions mt-2">
                    <Link 
                      href={`/learning/${course._id}`}
                      className="btn btn-primary btn-sm md:btn-md btn-block group-hover:btn-secondary transition-all"
                    >
                      <FaPlay className="text-xs" />
                      View Course Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="container mx-auto px-4 py-10">
          <div className="card bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-content shadow-xl">
            <div className="card-body text-center p-6 lg:p-8">
              <h2 className="card-title justify-center text-2xl lg:text-3xl mb-5">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-base lg:text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                Join thousands of students and professionals advancing their careers with CareerOstad's expert-led courses
              </p>
              <div className="card-actions justify-center flex flex-col sm:flex-row gap-3">
                <Link href="/signup" className="btn btn-md bg-base-100 text-primary hover:bg-base-200 shadow hover:shadow-md transition-all px-6">
                  Create Free Account
                </Link>
                <Link href="/login" className="btn btn-md btn-outline bg-transparent border-base-100 text-base-100 hover:bg-base-100 hover:text-primary transition-all px-6">
                  Sign In to Continue
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}