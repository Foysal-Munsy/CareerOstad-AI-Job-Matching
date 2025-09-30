"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaUserShield, FaEdit, FaSave, FaTimes, FaSearch, FaFilter, FaUsers, FaBuilding, FaUser, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function RoleManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Users',
          text: 'Unable to fetch users from the server. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdating(true);

      const response = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: newRole
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local state
        setUsers(users.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        ));

        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Role Updated!',
          text: `User role has been successfully changed to ${newRole}.`,
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true
        });
      } else {
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: result.error || 'Failed to update user role. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setUpdating(false);
      setEditingUser(null);
    }
  };

  // Start editing user role
  const startEditing = (userId) => {
    setEditingUser(userId);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="w-4 h-4 text-red-500" />;
      case 'company':
        return <FaBuilding className="w-4 h-4 text-blue-500" />;
      case 'candidate':
        return <FaUser className="w-4 h-4 text-green-500" />;
      default:
        return <FaUser className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-error';
      case 'company':
        return 'badge-primary';
      case 'candidate':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Role statistics
  const roleStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    company: users.filter(u => u.role === 'company').length,
    candidate: users.filter(u => u.role === 'candidate').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUserShield className="text-primary" />
            Role Management
          </h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Users</div>
              <div className="stat-value text-primary">{roleStats.total}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Admins</div>
              <div className="stat-value text-error">{roleStats.admin}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Companies</div>
              <div className="stat-value text-info">{roleStats.company}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Candidates</div>
              <div className="stat-value text-success">{roleStats.candidate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="input-group">
                <span className="bg-base-200">
                  <FaSearch className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="input input-bordered flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="form-control">
              <div className="input-group">
                <span className="bg-base-200">
                  <FaFilter className="w-4 h-4" />
                </span>
                <select
                  className="select select-bordered"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="company">Company</option>
                  <option value="candidate">Candidate</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Created</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm font-semibold">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">{user.email}</div>
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <select
                          className="select select-sm select-bordered"
                          defaultValue={user.role}
                          onChange={(e) => {
                            if (e.target.value !== user.role) {
                              handleRoleChange(user._id, e.target.value);
                            }
                          }}
                        >
                          <option value="candidate">Candidate</option>
                          <option value="company">Company</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <div className="badge badge-lg gap-2">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={cancelEditing}
                            disabled={updating}
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => startEditing(user._id)}
                          disabled={updating}
                        >
                          <FaEdit className="w-4 h-4" />
                          Edit Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Users Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterRole
                  ? 'Try adjusting your search criteria.'
                  : 'No users available at the moment.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Role Information */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Role Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <FaUserShield className="w-6 h-6 text-red-500" />
              <div>
                <div className="font-semibold">Admin</div>
                <div className="text-sm text-gray-600">Full system access and management</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <FaBuilding className="w-6 h-6 text-blue-500" />
              <div>
                <div className="font-semibold">Company</div>
                <div className="text-sm text-gray-600">Can post jobs and manage applications</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <FaUser className="w-6 h-6 text-green-500" />
              <div>
                <div className="font-semibold">Candidate</div>
                <div className="text-sm text-gray-600">Can apply for jobs and manage profile</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
