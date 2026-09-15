"use client";

import { useState, useEffect, useMemo } from "react";
import { api, getApiError } from "@/lib/api";
import { 
  Mail, 
  Trash2, 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Calendar, 
  Copy, 
  Check,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import toast from "react-hot-toast";

interface Subscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt: string;
  updatedAt?: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response = await api.get("/newsletter/subscribers");
      setSubscribers(response.data || []);
      if (isManualRefresh) {
        toast.success("Subscriber list refreshed");
      }
    } catch (error) {
      console.error("Failed to fetch newsletter subscribers:", error);
      toast.error(getApiError(error) || "Failed to load newsletter subscribers");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    const nextStatus = subscriber.status === "active" ? "unsubscribed" : "active";
    setActionLoadingId(subscriber.id);
    try {
      await api.patch(`/newsletter/subscribers/${subscriber.id}/status`, { status: nextStatus });
      setSubscribers((prev) =>
        prev.map((s) => (s.id === subscriber.id ? { ...s, status: nextStatus } : s))
      );
      toast.success(`Subscriber marked as ${nextStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(getApiError(error) || "Failed to update subscriber status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete subscriber "${email}"?`)) {
      return;
    }

    setActionLoadingId(id);
    try {
      await api.delete(`/newsletter/subscribers/${id}`);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subscriber removed successfully.");
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
      toast.error(getApiError(error) || "Failed to remove subscriber");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error("No subscriber data to export");
      return;
    }

    const headers = ["ID", "Email", "Status", "Subscribed At"];
    const rows = filteredSubscribers.map((s) => [
      `"${s.id}"`,
      `"${s.email}"`,
      `"${s.status}"`,
      `"${new Date(s.createdAt).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((item) => {
      const matchesSearch = item.email.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchQuery, statusFilter]);

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const unsubscribedCount = subscribers.filter((s) => s.status === "unsubscribed").length;

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-brand-600" /> Newsletter Subscribers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View, search, and manage all users subscribed via the website footer newsletter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSubscribers(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Subscribers</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{isLoading ? "..." : subscribers.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Subscribers</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{isLoading ? "..." : activeCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unsubscribed</p>
            <p className="text-2xl font-bold text-slate-600 mt-1">{isLoading ? "..." : unsubscribedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Filter Status:</label>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                statusFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({subscribers.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                statusFilter === "active" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter("unsubscribed")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                statusFilter === "unsubscribed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unsubscribed ({unsubscribedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">
            Subscribers List ({filteredSubscribers.length})
          </h2>
          {searchQuery && (
            <span className="text-xs text-slate-500">
              Showing results for &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo;
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-3 opacity-60" />
              <p className="text-sm">Loading subscriber data...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <h3 className="text-base font-semibold text-slate-700">No subscribers found</h3>
              <p className="text-sm mt-1 text-slate-500">
                {searchQuery ? "Try refining your search filter." : "No one has subscribed to the newsletter yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Subscribed Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscribers.map((subscriber, index) => (
                  <tr key={subscriber.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{subscriber.email}</span>
                        <button
                          onClick={() => handleCopyEmail(subscriber.email, subscriber.id)}
                          className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedId === subscriber.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(subscriber.createdAt).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {subscriber.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(subscriber)}
                          disabled={actionLoadingId === subscriber.id}
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer disabled:opacity-50"
                          title={subscriber.status === "active" ? "Mark as Unsubscribed" : "Mark as Active"}
                        >
                          {subscriber.status === "active" ? (
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(subscriber.id, subscriber.email)}
                          disabled={actionLoadingId === subscriber.id}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
