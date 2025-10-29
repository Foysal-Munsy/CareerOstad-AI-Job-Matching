"use client";

import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

export default function CandidateNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load notifications");
        if (isMounted) setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } catch (e) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <FaBell className="w-7 h-7" /> Notifications
          </h1>
          <p className="text-base-content/60 mt-1">Stay updated with job activity and account alerts.</p>
        </div>
      </div>

      <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm">
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent</h2>
        </div>

        <div className="divide-y divide-base-300">
          {loading ? (
            <div className="p-6 text-base-content/70">Loading...</div>
          ) : error ? (
            <div className="p-6 text-error">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center">
              <FaBell className="w-10 h-10 mx-auto text-base-content/30" />
              <p className="mt-3 text-base-content/60">You're all caught up. No notifications yet.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n._id || n.id} className="p-6 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${n.read ? 'bg-base-200 text-base-content/60' : 'bg-primary/10 text-primary'}`}>
                  <FaBell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{n.title || 'Notification'}</p>
                    <span className="text-xs text-base-content/60">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">{n.message || n.body || ''}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


