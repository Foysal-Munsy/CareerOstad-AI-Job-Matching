"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function EditCoursePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    lessons: [],
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.success) {
        const course = {
          ...data.course,
          lessons: data.course.lessons && data.course.lessons.length > 0 
            ? data.course.lessons 
            : [{ title: '', description: '', content: '', contentType: 'text', duration: 0, order: 1 }]
        };
        setFormData(course);
        setPreviewUrl(course.thumbnail);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/admin/courses');
      } else {
        alert('Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/courses" className="btn btn-ghost btn-sm btn-circle">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Edit Course</h1>
          <p className="text-base-content/60 mt-1">Update course information</p>
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
              {formData.lessons.map((lesson, index) => (
                <div key={index} className="border border-base-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Lesson {index + 1}</h3>
                    {formData.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(index)}
                        className="btn btn-error btn-xs"
                      >
                        <FaTrash />
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
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/admin/courses" className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary gap-2" disabled={submitting}>
            <FaSave />
            {submitting ? 'Updating...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

