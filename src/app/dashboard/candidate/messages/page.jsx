"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaEnvelope, FaUser, FaClock, FaReply } from "react-icons/fa";

export default function CandidateMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePeer, setActivePeer] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const url = activePeer ? `/api/messages?peerEmail=${encodeURIComponent(activePeer)}` : "/api/messages";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } else {
        setError(data.error || "Failed to fetch messages");
      }
    } catch (e) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchMessages();
    }
  }, [session?.user?.email, activePeer]);

  const handleSend = async () => {
    try {
      if (!activePeer || !draft.trim()) return;
      setSending(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverEmail: activePeer,
          body: draft.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDraft("");
        await fetchMessages();
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (e) {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const peers = useMemo(() => {
    const set = new Set();
    for (const m of messages) {
      const other = m.senderEmail === session?.user?.email ? m.receiverEmail : m.senderEmail;
      if (other) set.add(other);
    }
    return Array.from(set);
  }, [messages, session?.user?.email]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FaEnvelope className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-100 rounded-xl shadow-sm border p-4">
          <h3 className="font-semibold mb-3">Conversations</h3>
          <div className="space-y-2">
            {peers.length === 0 ? (
              <div className="text-sm text-base-content/60">No conversations yet.</div>
            ) : (
              peers.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePeer(p)}
                  className={`w-full text-left p-3 rounded-lg border ${activePeer === p ? "border-primary bg-primary/5" : "border-base-300 hover:bg-base-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{p}</div>
                      <div className="text-xs text-base-content/60">Tap to view conversation</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-base-100 rounded-xl shadow-sm border p-4">
          {loading ? (
            <div className="p-6 text-center text-base-content/70">Loading messages...</div>
          ) : error ? (
            <div className="p-6 text-center text-error">{error}</div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-base-content/70">No messages to display.</div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                {messages
                  .filter((m) => !activePeer || m.senderEmail === activePeer || m.receiverEmail === activePeer)
                  .map((m, idx) => {
                    const isMe = m.senderEmail === session?.user?.email;
                    return (
                      <div key={idx} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                        <div className="chat-header text-xs text-base-content/60 flex items-center gap-2">
                          <span>{isMe ? "You" : m.senderEmail}</span>
                          <span className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                          </span>
                        </div>
                        {m.subject ? (
                          <div className={`chat-bubble ${isMe ? "chat-bubble-primary" : ""}`}>
                            <div className="font-semibold mb-1">{m.subject}</div>
                            <div>{m.body}</div>
                          </div>
                        ) : (
                          <div className={`chat-bubble ${isMe ? "chat-bubble-primary" : ""}`}>{m.body}</div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="mt-2 border-t pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder={activePeer ? `Message ${activePeer}` : "Select a conversation to reply"}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    disabled={!activePeer || sending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    disabled={!activePeer || !draft.trim() || sending}
                    onClick={handleSend}
                  >
                    {sending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <span className="flex items-center gap-2"><FaReply className="w-4 h-4" /> Send</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


