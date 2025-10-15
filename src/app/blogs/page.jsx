"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowRight, FaSearch, FaFilter } from "react-icons/fa";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/advice');
      const result = await response.json();
      if (result.success) {
        setBlogs(result.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  };

  const categories = ["all", ...new Set(blogs.map(blog => blog.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300/60">
      {/* Header */}
      <div className="bg-base-100/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Career Blog</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover expert insights, tips, and guidance to advance your career
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-10 h-12 focus:input-primary"
                />
              </div>
              <div className="relative">
                <FaFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select select-bordered pl-10 pr-8 h-12"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No blogs found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No published blogs available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="group bg-base-100/80 backdrop-blur rounded-2xl shadow-md ring-1 ring-black/5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                {/* Blog Image */}
                <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
                  <img
                    src={blog.image || "/placeholder-blog.jpg"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge badge-primary badge-sm shadow">{blog.category}</span>
                  </div>
                </div>
                
                {/* Blog Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold md:text-2xl text-gray-900 mb-2 line-clamp-2 tracking-tight">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-5 line-clamp-3">
                    {blog.content.substring(0, 160)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      {blog.author && (
                        <div className="flex items-center gap-1">
                          <FaUser className="w-3 h-3" />
                          <span>{blog.author}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link
                      href={`/blogs/${blog.slug || blog._id}`}
                      className="btn btn-primary btn-sm gap-2 shadow-md"
                    >
                      Read More
                      <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-primary text-primary-content py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Get the latest career insights and job search tips delivered to your inbox
          </p>
          <Link href="/signup" className="btn btn-secondary btn-lg shadow-md">
            Join Our Community
          </Link>
        </div>
      </div>
    </div>
  );
}
