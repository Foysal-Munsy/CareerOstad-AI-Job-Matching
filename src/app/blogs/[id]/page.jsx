"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShare, FaBookmark } from "react-icons/fa";
import { useParams } from "next/navigation";

export default function BlogDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/advice`);
      const result = await response.json();
      
      if (result.success) {
        // Find the blog by ID or slug
        const foundBlog = result.data.find(b => b._id === id || b.slug === id);
        if (foundBlog) {
          setBlog(foundBlog);
          // Estimate reading time at ~200 wpm
          const words = (foundBlog.content || "").trim().split(/\s+/).length;
          setReadingTime(Math.max(1, Math.ceil(words / 200)));
        } else {
          setError("Blog not found");
        }
      } else {
        setError("Failed to fetch blog");
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError("Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch('/api/advice');
      const result = await response.json();
      
      if (result.success) {
        // Get 3 random blogs excluding the current one
        const otherBlogs = result.data.filter(b => b._id !== id && b.slug !== id);
        const shuffled = otherBlogs.sort(() => 0.5 - Math.random());
        setRelatedBlogs(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.content.substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">Blog Not Found</h2>
          <p className="text-base-content/70 mb-4">
            {error || "The blog post you're looking for doesn't exist."}
          </p>
          <Link href="/blogs" className="btn btn-primary">
            Browse All Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300/60">
      {/* Breadcrumb */}
      <div className="bg-base-100/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="breadcrumbs text-sm">
            <ul>
              <li><Link href="/" className="text-primary hover:underline">Home</Link></li>
              <li><Link href="/blogs" className="text-primary hover:underline">Blogs</Link></li>
              <li className="truncate max-w-xs" title={blog.title}>{blog.title}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-focus mb-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>

          {/* Blog Header */}
          <div className="bg-base-100/80 backdrop-blur rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden mb-8">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] bg-gray-200 overflow-hidden">
              <img
                src={blog.image || "/placeholder-blog.jpg"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
            </div>

            {/* Blog Info */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-primary badge-lg shadow">{blog.category}</span>
                <span className="badge badge-success">Published</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                {blog.title}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    <span>By {blog.author || 'CareerOstad Team'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{readingTime} min read</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={shareBlog}
                    className="btn btn-ghost btn-sm gap-2"
                    title="Share"
                  >
                    <FaShare className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    className="btn btn-ghost btn-sm gap-2"
                    title="Save"
                  >
                    <FaBookmark className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary-focus prose-strong:text-gray-900 prose-blockquote:border-l-primary prose-hr:border-base-300 prose-img:rounded-xl prose-li:marker:text-primary">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-primary">
                  {blog.content}
                </div>
              </div>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    href={`/blogs/${relatedBlog.slug || relatedBlog._id}`}
                    className="group bg-base-100/80 backdrop-blur rounded-2xl shadow-md ring-1 ring-black/5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
                      <img
                        src={relatedBlog.image || "/placeholder-blog.jpg"}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
                    </div>
                    <div className="p-5">
                      <span className="badge badge-primary badge-sm mb-2 shadow">
                        {relatedBlog.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 tracking-tight">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedBlog.content.substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 bg-primary text-primary-content rounded-2xl p-8 text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Advance Your Career?</h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who are using our platform to find their dream jobs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn btn-secondary btn-lg shadow-md">
                Get Started Today
              </Link>
              <Link href="/jobs" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
