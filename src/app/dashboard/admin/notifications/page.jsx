'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FaBell,
  FaPlus,
  FaCheck,
  FaTrash,
  FaFilter,
  FaEnvelope,
  FaBriefcase,
  FaUserCheck,
  FaFileAlt,
  FaExclamationCircle,
  FaInfoCircle,
  FaSyncAlt,
  FaSearch,
  FaChartBar,
  FaUsers
} from 'react-icons/fa';

export default function AdminNotifications() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchNotifications();
    }
  }, [status, session?.user?.role]);

  async function fetchNotifications() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load notifications');
      }
      const data = await res.json();
      setNotifications(data.notifications || []);
      setStats(data.stats || {});
    } catch (e) {
      setError('Could not fetch notifications');
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationIds: [notificationId],
          read: true
        })
      });
      
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error('Error:', e);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      });
      
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error('Error:', e);
    }
  }

  async function handleDelete(notificationId) {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      const res = await fetch(`/api/admin/notifications?id=${notificationId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error('Error:', e);
    }
  }

  async function handleDeleteAllRead() {
    if (!confirm('Are you sure you want to delete all read notifications?')) return;
    
    try {
      const res = await fetch('/api/admin/notifications?deleteAllRead=true', {
        method: 'DELETE'
      });
      
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error('Error:', e);
    }
  }

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !n.read) ||
                         (filter === 'read' && n.read);
    
    const matchesSearch = searchQuery === '' || 
                         n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return <div className="p-4">Unauthorized</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job': return <FaBriefcase className="text-success" />;
      case 'application': return <FaFileAlt className="text-info" />;
      case 'verification': return <FaUserCheck className="text-warning" />;
      case 'system': return <FaExclamationCircle className="text-error" />;
      default: return <FaBell className="text-primary" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'badge-error';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-info';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications Management</h1>
          <p className="mt-1 text-base-content/70">Manage system-wide notifications</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchNotifications}
            className="btn btn-sm btn-primary gap-2"
          >
            <FaSyncAlt /> Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-sm btn-success gap-2"
          >
            <FaPlus /> Create
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Notifications"
          value={stats.totalNotifications || 0}
          icon={FaBell}
          color="text-primary"
        />
        <StatCard
          title="Unread"
          value={stats.unreadNotifications || 0}
          icon={FaEnvelope}
          color="text-warning"
        />
        <StatCard
          title="Last 7 Days"
          value={stats.notificationsLast7Days || 0}
          icon={FaChartBar}
          color="text-success"
        />
        <StatCard
          title="Last 30 Days"
          value={stats.notificationsLast30Days || 0}
          icon={FaUsers}
          color="text-info"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`btn btn-sm ${filter === 'unread' ? 'btn-warning' : 'btn-outline'}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`btn btn-sm ${filter === 'read' ? 'btn-success' : 'btn-outline'}`}
          >
            Read
          </button>
        </div>
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="input input-bordered w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="btn btn-sm btn-outline gap-2"
        >
          <FaCheck /> Mark All Read
        </button>
        <button
          onClick={handleDeleteAllRead}
          className="btn btn-sm btn-error gap-2"
        >
          <FaTrash /> Delete Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-xl border border-base-300 bg-base-100">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold">
            Notifications ({filteredNotifications.length})
          </h2>
        </div>
        <div className="divide-y divide-base-300">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-base-content/60">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-base-200/50 transition-colors ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <span className="badge badge-xs badge-primary">New</span>
                          )}
                        </div>
                        <p className="text-sm text-base-content/70 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-base-content/60">
                          <span className={`badge badge-sm ${getPriorityColor(notification.priority)}`}>
                            {notification.priority || 'normal'}
                          </span>
                          <span className="badge badge-sm badge-outline">
                            {notification.type || 'general'}
                          </span>
                          <span>
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          {notification.recipientEmail && (
                            <span className="text-primary">
                              To: {notification.recipientEmail}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="btn btn-xs btn-success"
                            title="Mark as read"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="btn btn-xs btn-error"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <CreateNotificationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchNotifications();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
      <div className="flex items-center gap-3">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-base-200 ${color}`}>
          <Icon className="text-xl" />
        </div>
        <div>
          <div className="text-sm text-base-content/70">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function CreateNotificationModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal',
    recipientEmail: '',
    recipientRole: '',
    sendToAll: false
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message || 'Notification created successfully');
        onSuccess();
      } else {
        alert(data.error || 'Failed to create notification');
      }
    } catch (e) {
      alert('Failed to create notification');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-xl p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Create Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text font-medium">Message</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="general">General</option>
                <option value="job">Job</option>
                <option value="application">Application</option>
                <option value="verification">Verification</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Priority</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Send to All Users</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={formData.sendToAll}
                onChange={(e) => setFormData({ ...formData, sendToAll: e.target.checked })}
              />
            </label>
          </div>
          {!formData.sendToAll && (
            <>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Recipient Email (optional)</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Recipient Role (optional)</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.recipientRole}
                  onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
                >
                  <option value="">All Roles</option>
                  <option value="candidate">Candidates</option>
                  <option value="company">Companies</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </>
          )}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

