"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';

export default function CreateCoursePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Web Development',
    level: 'Beginner',
    duration: 0,
    thumbnail: '',
    instructorName: 'CareerOstad Team',
    price: 0,
    tags: [],
    lessons: [{ title: '', description: '', content: '', contentType: 'text', duration: 0, order: 1 }],
    isActive: true,
    isFeatured: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/admin/courses');
      } else {
        alert('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = () => {
    setFormData({
      ...formData,
      lessons: [
        ...formData.lessons,
        { title: '', description: '', content: '', contentType: 'text', duration: 0, order: formData.lessons.length + 1 }
      ]
    });
  };

  const handleRemoveLesson = (index) => {
    setFormData({
      ...formData,
      lessons: formData.lessons.filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload/course-thumbnail', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, thumbnail: data.url });
        setPreviewUrl(data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index][field] = value;
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'UI/UX Design',
    'Digital Marketing',
    'Business Analysis',
    'Project Management',
    'Other'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const contentTypes = ['video', 'pdf', 'text', 'quiz', 'link'];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/courses" className="btn btn-ghost btn-sm btn-circle">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Create New Course</h1>
          <p className="text-base-content/60 mt-1">Add a new course to the learning platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Course Title</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Complete Web Development Bootcamp"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Level</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  required
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Duration (hours)</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Price</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                />
                <label className="label">
                  <span className="label-text-alt">Set to 0 for free courses</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Instructor Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Short Description</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief description (max 200 characters)"
                  maxLength={200}
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Full Description</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Detailed description of the course..."
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Course Thumbnail</span>
                </label>
                
                {/* Upload Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="file-input file-input-bordered w-full"
                />
                
                {uploading && (
                  <label className="label">
                    <span className="label-text-alt text-info">Uploading...</span>
                  </label>
                )}
                
                {/* Preview */}
                {(previewUrl || formData.thumbnail) && (
                  <div className="mt-4">
                    <img
                      src={previewUrl || formData.thumbnail}
                      alt="Course thumbnail"
                      className="w-full h-64 object-cover rounded-lg border border-base-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, thumbnail: '' });
                        setPreviewUrl('');
                      }}
                      className="btn btn-sm btn-error btn-outline mt-2"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                
                <label className="label">
                  <span className="label-text-alt">Or paste image URL below</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered mt-2"
                  value={formData.thumbnail}
                  onChange={(e) => {
                    setFormData({ ...formData, thumbnail: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text font-semibold">Is Active</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text font-semibold">Is Featured</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Course Lessons</h2>
              <button
                type="button"
                onClick={handleAddLesson}
                className="btn btn-primary btn-sm gap-2"
              >
                <FaSave /> Add Lesson
              </button>
            </div>

            <div className="space-y-4">
              {formData.lessons && formData.lessons.length > 0 ? (
                formData.lessons.map((lesson, index) => (
                <div key={index} className="border border-base-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Lesson {index + 1}</h3>
                    {formData.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(index)}
                        className="btn btn-error btn-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Lesson Title</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                        placeholder="Lesson title"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Content Type</span>
                      </label>
                      <select
                        className="select select-bordered select-sm"
                        value={lesson.contentType}
                        onChange={(e) => handleLessonChange(index, 'contentType', e.target.value)}
                      >
                        {contentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Duration (minutes)</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered input-sm"
                        value={lesson.duration}
                        onChange={(e) => handleLessonChange(index, 'duration', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Order</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered input-sm"
                        value={lesson.order}
                        onChange={(e) => handleLessonChange(index, 'order', parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold">Description</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered textarea-sm"
                        value={lesson.description}
                        onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
                        placeholder="Lesson description"
                        rows="2"
                      />
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold">Content (URL or Text)</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered textarea-sm"
                        value={lesson.content}
                        onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                        placeholder="Content URL or text"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  No lessons added yet. Click "Add Lesson" to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/admin/courses" className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary gap-2" disabled={loading}>
            <FaSave />
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

