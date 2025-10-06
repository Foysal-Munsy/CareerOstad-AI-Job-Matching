"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function AdminCandidatesPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
const handleDelete = async (_id) => {
  const confirmation = await Swal.fire({
    title: "Do you really want to delete?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });

  if (!confirmation.isConfirmed) return;

  try {
    const res = await fetch(`/api/deletecandidate?id=${_id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !(data?.deletedCount > 0)) {
      throw new Error(data?.message || "Delete failed");
    }
    await Swal.fire({ title: "Deleted!", text: "Candidate has been deleted.", icon: "success" });
    const remainingUsers = users.filter((user) => user._id !== _id);
    setUsers(remainingUsers);
  } catch (e) {
    Swal.fire({ title: "Error", text: e.message || "Failed to delete", icon: "error" });
  }
}
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

  if (status === "loading") {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || session.user?.role !== "admin") {
    return <div className="p-4">Unauthorized</div>;
  }

  const displayedUsers = users.filter(u => u.role === "candidate");

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="mt-1 text-base-content/70">Only candidate accounts are shown here.</p>
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
          <div className="text-sm text-base-content/70">
            Total: <span className="font-semibold">{loading ? '-' : displayedUsers.length}</span>
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
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">Loading...</td>
                  </tr>
                ) : (
                  displayedUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="font-medium">{u.name || "Unknown"}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge badge-sm ${u.role === 'company' ? 'badge-warning' : 'badge-info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                      <td><button className="btn bg-red-500 text-white" onClick={()=>{handleDelete(u._id)}}>Delete</button> </td>
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


