"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { FaUsers, FaSearch, FaFilter, FaTimes } from "react-icons/fa";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const handleDelete = async (_id, userRole) => {
    const confirmation = await Swal.fire({
      title: "Do you really want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmation.isConfirmed) return;

    try {
      // Use appropriate delete endpoint based on role
      const endpoint = userRole === "company" 
        ? `/api/deletecompany?id=${_id}`
        : `/api/deletecandidate?id=${_id}`;
      
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok || !(data?.deletedCount > 0)) {
        throw new Error(data?.message || "Delete failed");
      }
      
      await Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
      });
      
      // Remove from state
      const remainingUsers = users.filter((user) => user._id !== _id);
      setUsers(remainingUsers);
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message || "Failed to delete",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (e) {
        setError("Could not load users");
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      loadUsers();
    }
  }, [status]);

  // Filter users based on search term and role filter
  useEffect(() => {
    let filtered = [...users];

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  if (status === "loading") {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="p-4">
        <div className="alert alert-error">
          <span>Unauthorized - Admin access required</span>
        </div>
      </div>
    );
  }

  // Get role counts
  const roleCounts = {
    all: users.length,
    candidate: users.filter((u) => u.role === "candidate").length,
    company: users.filter((u) => u.role === "company").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "badge-error";
      case "company":
        return "badge-warning";
      case "candidate":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaUsers className="text-primary" />
          All Users
        </h1>
        <p className="mt-1 text-base-content/70">
          Manage all user accounts across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-lg border border-base-300">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-2xl">{loading ? "-" : roleCounts.all}</div>
        </div>
        <div className="stat bg-base-100 rounded-lg border border-base-300">
          <div className="stat-title">Candidates</div>
          <div className="stat-value text-2xl text-info">
            {loading ? "-" : roleCounts.candidate}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg border border-base-300">
          <div className="stat-title">Companies</div>
          <div className="stat-value text-2xl text-warning">
            {loading ? "-" : roleCounts.company}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-lg border border-base-300">
          <div className="stat-title">Admins</div>
          <div className="stat-value text-2xl text-error">
            {loading ? "-" : roleCounts.admin}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="label">
              <span className="label-text">Search Users</span>
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Role Filter */}
          <div className="md:w-48">
            <label className="label">
              <span className="label-text">Filter by Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="candidate">Candidates</option>
              <option value="company">Companies</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || roleFilter !== "all") && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-base-content/70">Active filters:</span>
            {searchTerm && (
              <span className="badge badge-outline gap-2">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-error"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            {roleFilter !== "all" && (
              <span className="badge badge-outline gap-2">
                Role: {roleFilter}
                <button
                  onClick={() => setRoleFilter("all")}
                  className="hover:text-error"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
          <div className="text-sm text-base-content/70">
            Showing:{" "}
            <span className="font-semibold">
              {loading ? "-" : filteredUsers.length}
            </span>{" "}
            of {loading ? "-" : users.length} users
          </div>
        </div>

        {error ? (
          <div className="p-4 text-error text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <span className="loading loading-spinner loading-md"></span>
                      <span className="ml-2">Loading users...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-base-content/50">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img src={u.image} alt={u.name} />
                              </div>
                            </div>
                          ) : (
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span className="text-xs">
                                  {u.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              </div>
                            </div>
                          )}
                          <span className="font-medium">{u.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${getRoleBadgeClass(u.role)}`}
                        >
                          {u.role || "candidate"}
                        </span>
                      </td>
                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td>
                        {u.role !== "admin" || u.email !== session.user?.email ? (
                          <button
                            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDelete(u._id, u.role)}
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-base-content/50">
                            Cannot delete own account
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

