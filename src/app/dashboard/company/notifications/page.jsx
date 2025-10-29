'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FaArrowLeft, FaBell, FaCheck, FaCheckDouble, FaTrash, 
  FaFilter, FaSearch, FaEnvelope, FaBriefcase, FaUser, 
  FaExclamationTriangle, FaInfoCircle, FaClock
} from 'react-icons/fa';

export default function CompanyNotificationsPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const isCompany = role === 'company' || role === 'admin';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, application, message, general, etc.
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && isCompany) {
      fetchNotifications();
    }
  }, [status, isCompany]);

  async function fetchNotifications() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        setError(data?.error || 'Failed to load notifications');
      }
    } catch (e) {
      setError('Could not fetch notifications');
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId) {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error('Error marking as read:', e);
    }
  }

  async function markAllAsRead() {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error('Error marking all as read:', e);
    }
  }

  function getRelativeTime(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  function getNotificationIcon(type) {
    switch (type?.toLowerCase()) {
      case 'application':
        return <FaBriefcase className="w-4 h-4" />;
      case 'message':
        return <FaEnvelope className="w-4 h-4" />;
      case 'warning':
        return <FaExclamationTriangle className="w-4 h-4" />;
      default:
        return <FaInfoCircle className="w-4 h-4" />;
    }
  }

  function getNotificationColor(type) {
    switch (type?.toLowerCase()) {
      case 'application':
        return 'bg-blue-500/10 text-blue-600';
      case 'message':
        return 'bg-green-500/10 text-green-600';
      case 'warning':
        return 'bg-orange-500/10 text-orange-600';
      default:
        return 'bg-primary/10 text-primary';
    }
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchFilter = filter === 'all' || 
        (filter === 'unread' && n.unread) || 
        (filter === 'read' && !n.unread);
      
      const matchType = typeFilter === 'all' || n.type?.toLowerCase() === typeFilter.toLowerCase();
      
      const matchSearch = !searchQuery || 
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchType && matchSearch;
    });
  }, [notifications, filter, typeFilter, searchQuery]);

  const unreadCount = notifications.filter(n => n.unread).length;

  if (status === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!isCompany) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-2xl font-bold">Restricted</h2>
          <p className="text-base-content/70 mt-1">Only company users can access Notifications.</p>
          <Link href="/dashboard" className="btn btn-primary btn-sm mt-4">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-base-100">
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/company" className="btn btn-ghost btn-circle">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Notifications</h1>
                <p className="text-base-content/70">Manage and view your company notifications</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="badge badge-primary badge-lg">{unreadCount} unread</div>
                <button onClick={markAllAsRead} className="btn btn-sm btn-outline">
                  <FaCheckDouble className="w-3 h-3" /> Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="rounded-xl p-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40 mb-6">
          <div className="bg-base-100 rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search notifications..."
                  className="input input-bordered w-full pl-10"
                />
              </div>
              <div>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>
              </div>
              <div>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Types</option>
                  <option value="application">Applications</option>
                  <option value="message">Messages</option>
                  <option value="general">General</option>
                  <option value="warning">Warnings</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <FaExclamationTriangle className="w-4 h-4" />
            <span>{error}</span>
            <button onClick={fetchNotifications} className="btn btn-sm btn-ghost">Retry</button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold mb-2">No notifications found</h3>
            <p className="text-base-content/70">
              {searchQuery || filter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'You\'re all caught up! No notifications at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl p-[1px] bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40 transition-all ${
                  notification.unread ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <div className={`bg-base-100 rounded-xl shadow-sm p-5 hover:shadow-md transition ${
                  notification.unread ? 'border-l-4 border-l-primary' : ''
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${notification.unread ? 'text-base-content' : 'text-base-content/70'}`}>
                            {notification.title || 'Notification'}
                          </h3>
                          {notification.unread && (
                            <span className="badge badge-primary badge-xs">New</span>
                          )}
                          {notification.priority === 'high' && (
                            <span className="badge badge-error badge-xs">High</span>
                          )}
                        </div>
                        <p className="text-sm text-base-content/70 mb-2">
                          {notification.message || 'No message'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-base-content/50">
                          <FaClock className="w-3 h-3" />
                          <span>{getRelativeTime(notification.time)}</span>
                          <span className="badge badge-ghost badge-xs">{notification.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {notification.unread && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="btn btn-sm btn-ghost"
                          title="Mark as read"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && notifications.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl p-[1px] bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-primary">{notifications.length}</div>
                <div className="text-xs text-base-content/70">Total</div>
              </div>
            </div>
            <div className="rounded-xl p-[1px] bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                <div className="text-xs text-base-content/70">Unread</div>
              </div>
            </div>
            <div className="rounded-xl p-[1px] bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
                <div className="text-xs text-base-content/70">Read</div>
              </div>
            </div>
            <div className="rounded-xl p-[1px] bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40">
              <div className="bg-base-100 rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {notifications.filter(n => n.type?.toLowerCase() === 'application').length}
                </div>
                <div className="text-xs text-base-content/70">Applications</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
