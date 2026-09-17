"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Bell, Trash2, Send, PlusCircle, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      return toast.error("Title and message are required.");
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`/notifications/${editingId}`, { title, message, type });
        toast.success("Notification updated successfully!");
        setEditingId(null);
      } else {
        await api.post("/notifications", { title, message, type });
        toast.success("Notification pushed to all users!");
      }
      setTitle("");
      setMessage("");
      setType("info");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to push/update notification:", error);
      toast.error(editingId ? "Failed to update notification." : "Failed to send notification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (notif: Notification) => {
    setEditingId(notif.id);
    setTitle(notif.title);
    setMessage(notif.message);
    setType(notif.type);
    toast.success("Editing mode enabled");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setMessage("");
    setType("info");
  };

  const handleDelete = async (id: string) => {
    // We could add a confirmation dialog here if desired, but for now we'll just delete
    try {
      await api.delete(`/notifications/${id}`);
      toast.success("Notification deleted successfully.");
      if (editingId === id) {
        cancelEdit();
      }
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to delete notification.");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             Notification Center
          </h1>
          <p className="text-slate-500 mt-1">Push announcements and alerts to all users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Push Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {editingId ? <Pencil className="w-5 h-5 text-brand-600" /> : <PlusCircle className="w-5 h-5 text-brand-600" />}
              {editingId ? "Edit Broadcast" : "New Broadcast"}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Cancel Edit"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <form onSubmit={handleCreateNotification} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New Course Added!"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Details about the announcement..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Type (Color)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm text-slate-900 appearance-none"
              >
                <option value="info">Info (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Orange)</option>
                <option value="alert">Alert (Red)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 bg-brand-600 text-white font-semibold px-2 py-2.5 rounded-lg flex justify-center items-center gap-2 hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? (editingId ? "Updating..." : "Pushing...") : (editingId ? "Update Broadcast" : "Send Broadcast")}
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900">Broadcast History</h2>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading history...</div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No notifications have been sent yet.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${notif.type === 'alert' ? 'bg-red-500' :
                          notif.type === 'warning' ? 'bg-orange-500' :
                            notif.type === 'success' ? 'bg-emerald-500' :
                              'bg-blue-500'
                        }`}></div>
                      <div>
                        <h4 className="font-bold text-slate-900">{notif.title}</h4>
                        <p className="text-slate-600 mt-1 text-sm">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEditClick(notif)}
                        className="text-slate-400 hover:text-brand-600 p-2 rounded-lg hover:bg-brand-100 transition-colors cursor-pointer"
                        title="Edit Notification">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(notif.id)}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                        title="Delete Notification">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
