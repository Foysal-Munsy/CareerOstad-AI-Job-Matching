"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminCandidatesPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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


