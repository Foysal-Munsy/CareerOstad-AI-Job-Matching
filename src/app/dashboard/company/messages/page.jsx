"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FaEnvelope, FaUser, FaClock, FaReply, FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";

export default function CompanyMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePeer, setActivePeer] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (session?.user?.email) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');
      newSocket.emit('join-room', session.user.email);
      setSocket(newSocket);

      newSocket.on('receive-message', (data) => {
        console.log('Client received message:', data);
        if (data.senderEmail && data.message) {
          const msg = data.message;
          const receivedMessage = {
            senderEmail: msg.senderEmail || data.senderEmail,
            receiverEmail: msg.receiverEmail || session.user.email,
            body: msg.body || '',
            subject: msg.subject || null,
            createdAt: msg.createdAt || new Date().toISOString(),
          };
          setMessages((prev) => {
            const exists = prev.some(m => 
              m.createdAt === receivedMessage.createdAt && 
              m.senderEmail === receivedMessage.senderEmail
            );
            if (exists) return prev;
            return [...prev, receivedMessage];
          });
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session?.user?.email]);

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
      const messageText = draft.trim();
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverEmail: activePeer,
          body: messageText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const newMessage = {
          senderEmail: session.user.email,
          receiverEmail: activePeer,
          body: messageText,
          subject: data.message.subject || null,
          createdAt: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, newMessage]);
        setDraft("");
        
        if (socket) {
          socket.emit('send-message', {
            senderEmail: session.user.email,
            receiverEmail: activePeer,
            message: newMessage
          });
        }
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
    const peerData = {};
    for (const m of messages) {
      const other = m.senderEmail === session?.user?.email ? m.receiverEmail : m.senderEmail;
      if (other) {
        if (!peerData[other]) {
          peerData[other] = {
            email: other,
            lastMessage: m.body,
            lastTime: m.createdAt,
            unread: 0
          };
        } else {
          if (new Date(m.createdAt) > new Date(peerData[other].lastTime)) {
            peerData[other].lastMessage = m.body;
            peerData[other].lastTime = m.createdAt;
          }
        }
      }
    }
    return Object.values(peerData).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
  }, [messages, session?.user?.email]);

  const getInitials = (email) => {
    if (!email) return "U";
    const parts = email.split("@")[0];
    return parts.charAt(0).toUpperCase() + (parts.length > 1 ? parts.charAt(1) : "").toUpperCase();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Header */}
      <div className="bg-white border-b border-base-300 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center shadow-lg">
              <FaEnvelope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-base-content">Messages</h1>
              <p className="text-sm text-base-content/60">Stay connected with your conversations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-base-300 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-base-300 bg-gradient-to-r from-primary/5 to-primary/10">
              <h3 className="font-bold text-lg text-base-content">Conversations</h3>
              <p className="text-xs text-base-content/60 mt-1">{peers.length} active</p>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {peers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 px-4">
                  <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                    <FaEnvelope className="w-8 h-8 text-base-content/40" />
                  </div>
                  <p className="text-sm font-medium text-base-content/70 mb-1">No conversations yet</p>
                  <p className="text-xs text-base-content/50 text-center">Start messaging to connect with others</p>
                </div>
              ) : (
                peers.map((peer) => (
                  <button
                    key={peer.email}
                    onClick={() => setActivePeer(peer.email)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      activePeer === peer.email 
                        ? "bg-gradient-to-r from-primary to-primary-focus text-white shadow-lg transform scale-[1.02]" 
                        : "bg-base-100 hover:bg-base-200 border border-base-300 hover:border-primary/30 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                        activePeer === peer.email 
                          ? "bg-white text-primary" 
                          : "bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
                      }`}>
                        {getInitials(peer.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm truncate ${activePeer === peer.email ? "text-white" : "text-base-content"}`}>
                          {peer.email.split("@")[0]}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs truncate ${
                            activePeer === peer.email ? "text-white/80" : "text-base-content/60"
                          }`}>
                            {typeof peer.lastMessage === 'string' ? peer.lastMessage : 'Sent a message'}
                          </span>
                        </div>
                      </div>
                      <div className={`text-xs font-medium ${
                        activePeer === peer.email ? "text-white/70" : "text-base-content/50"
                      }`}>
                        {formatTime(peer.lastTime)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-base-300 overflow-hidden flex flex-col">
            {!activePeer ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="w-12 h-12 text-primary/60" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content mb-2">Select a Conversation</h3>
                  <p className="text-sm text-base-content/60 max-w-md mx-auto">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-sm text-base-content/70 mt-3">Loading messages...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-error">
                  <p>{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-base-300 bg-gradient-to-r from-base-100 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center text-white font-bold shadow-md">
                      {getInitials(activePeer)}
                    </div>
                    <div>
                      <div className="font-bold text-base-content">{activePeer.split("@")[0]}</div>
                      <div className="text-xs text-base-content/60">Online</div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-base-100/50 to-white">
                  {messages
                    .filter((m) => m.senderEmail === activePeer || m.receiverEmail === activePeer)
                    .map((m, idx) => {
                      const isMe = m.senderEmail === session?.user?.email;
                      return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex gap-3 max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isMe && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs shadow-md">
                                {getInitials(m.senderEmail)}
                              </div>
                            )}
                            <div className={`rounded-2xl px-4 py-3 shadow-md transition-all hover:shadow-lg ${
                              isMe 
                                ? 'bg-gradient-to-br from-primary to-primary-focus text-white' 
                                : 'bg-white border border-base-300 text-base-content'
                            }`}>
                              {m.subject && (
                                <div className={`font-semibold text-sm mb-1 ${isMe ? 'text-white' : 'text-primary'}`}>
                                  {m.subject}
                                </div>
                              )}
                              <div className={`text-sm leading-relaxed ${isMe ? 'text-white' : 'text-base-content'}`}>
                                {typeof m.body === 'string' ? m.body : JSON.stringify(m.body)}
                              </div>
                              <div className={`text-xs mt-2 ${isMe ? 'text-white/70' : 'text-base-content/50'}`}>
                                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-base-300 bg-white">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        rows={1}
                        className="textarea textarea-bordered w-full resize-none pr-12 focus:border-primary focus:outline-none transition-all"
                        placeholder={activePeer ? `Message ${activePeer.split("@")[0]}...` : "Select a conversation to reply"}
                        value={draft}
                        onChange={(e) => {
                          setDraft(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        disabled={sending}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                    </div>
                    <button
                      className="btn btn-primary rounded-full px-6 shadow-md hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!draft.trim() || sending}
                      onClick={handleSend}
                    >
                      {sending ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <FaPaperPlane className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

