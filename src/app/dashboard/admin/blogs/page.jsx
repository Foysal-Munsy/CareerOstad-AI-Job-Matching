"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaImage, FaCalendarAlt, FaUser, FaUpload } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import Link from "next/link";

export default function AdminAdvicePage() {
  const [advicePosts, setAdvicePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Resume Tips',
    image: '',
    status: 'draft',
    author: 'Admin'
  });
  const [uploading, setUploading] = useState(false);

  // Fetch posts from new blogs API
  useEffect(() => {
    fetchAdvicePosts();
  }, []);

  const fetchAdvicePosts = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      const result = await response.json();
      if (result.success) {
        setAdvicePosts(result.data);
      }
    } catch (error) {
      console.error('Error fetching advice posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          setAdvicePosts(advicePosts.filter(post => post._id !== id));
        }
      } catch (error) {
        console.error('Error deleting advice post:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        setAdvicePosts(advicePosts.map(post => 
          post._id === id ? { ...post, status: newStatus } : post
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setAdvicePosts([result.data, ...advicePosts]);
        setFormData({
          title: '',
          content: '',
          category: 'Resume Tips',
          image: '',
          status: 'draft',
          author: 'Admin'
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error creating advice post:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage career blog posts and content</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Total Posts</div>
          <div className="stat-value text-primary">{advicePosts.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Published</div>
          <div className="stat-value text-success">
            {advicePosts.filter(post => post.status === 'published').length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Drafts</div>
          <div className="stat-value text-warning">
            {advicePosts.filter(post => post.status === 'draft').length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Categories</div>
          <div className="stat-value text-info">
            {new Set(advicePosts.map(post => post.category)).size}
          </div>
        </div>
      </div>

      <div className="bg-base-100 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Blog Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {advicePosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td>
                    <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="max-w-xs">
                      <div className="font-medium text-gray-900 truncate">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {post.content.substring(0, 60)}...
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {post.category}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{post.author}</span>
                    </div>
                  </td>
                  <td>
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post._id, e.target.value)}
                      className={`select select-sm ${
                        post.status === 'published' ? 'text-success' : 'text-warning'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/advice/${post.slug || post._id}`}
                        className="btn btn-ghost btn-sm"
                        title="View"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/admin/blogs/${post._id}`}
                        className="btn btn-ghost btn-sm text-warning"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="btn btn-ghost btn-sm text-error"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Blog Post</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog post title"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Author</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="Resume Tips">Resume Tips</option>
                  <option value="Interview Tips">Interview Tips</option>
                  <option value="Career Planning">Career Planning</option>
                  <option value="Job Search">Job Search</option>
                  <option value="Job Applications">Job Applications</option>
                  <option value="Interview Preparation">Interview Preparation</option>
                  <option value="Salary Negotiation">Salary Negotiation</option>
                  <option value="Career Growth">Career Growth</option>
                  <option value="Career Change">Career Change</option>
                  <option value="Remote Work">Remote Work</option>
                  <option value="Work-Life Balance">Work-Life Balance</option>
                  <option value="Networking">Networking</option>
                  <option value="LinkedIn Optimization">LinkedIn Optimization</option>
                  <option value="Portfolio & Personal Branding">Portfolio & Personal Branding</option>
                  <option value="Internships & Entry-Level">Internships & Entry-Level</option>
                  <option value="Freelancing & Gig Work">Freelancing & Gig Work</option>
                  <option value="Tech Careers">Tech Careers</option>
                  <option value="Non-Tech Careers">Non-Tech Careers</option>
                  <option value="Management & Leadership">Management & Leadership</option>
                  <option value="Productivity & Skills">Productivity & Skills</option>
                  <option value="Industry Trends">Industry Trends</option>
                  <option value="Company Culture">Company Culture</option>
                  <option value="Employee Benefits">Employee Benefits</option>
                  <option value="Professional Development">Professional Development</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Featured Image</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.image ? (
                    <div className="space-y-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-32 h-20 object-cover mx-auto rounded"
                      />
                      <p className="text-sm text-gray-500">Image uploaded successfully</p>
                    </div>
                  ) : (
                    <div>
                      <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Click to upload image or drag and drop</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    id="image-upload"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className="btn btn-sm btn-outline mt-2 cursor-pointer"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="w-4 h-4" />
                        Choose Image
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog content here..."
                  className="textarea textarea-bordered w-full h-32"
                  required
                ></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


