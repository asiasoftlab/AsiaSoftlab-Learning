"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditOpportunityPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "Full-time",
    applyLink: "",
    status: "Open",
  });

  useEffect(() => {
    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const response = await api.get(`/opportunities/${id}`);
      setFormData({
        title: response.data.title || "",
        description: response.data.description || "",
        company: response.data.company || "",
        location: response.data.location || "",
        type: response.data.type || "Full-time",
        applyLink: response.data.applyLink || "",
        status: response.data.status || "Open",
      });
    } catch (error) {
      console.error("Failed to fetch opportunity:", error);
      toast.error("Failed to load opportunity details");
      router.push("/admin/opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put(`/opportunities/${id}`, formData);
      toast.success("Opportunity updated successfully");
      router.push("/admin/opportunities");
    } catch (error: any) {
      console.error("Failed to update opportunity:", error);
      toast.error(error.response?.data?.message || "Failed to update opportunity");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/opportunities" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Edit Opportunity</h2>
          <p className="text-sm text-slate-500">Update career opportunity posting.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Opportunity Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-900 bg-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-900 bg-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Opportunity Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white text-slate-900"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Application Link (External URL) *</label>
              <input
                type="url"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-900 bg-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm min-h-[200px] text-slate-900 bg-white placeholder:text-slate-400"
                required
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white text-slate-900"
                required
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <Link href="/admin/opportunities" className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
