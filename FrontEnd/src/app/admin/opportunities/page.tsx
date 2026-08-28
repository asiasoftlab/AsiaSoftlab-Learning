"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await api.get("/opportunities");
      setOpportunities(response.data);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      toast.error("Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setOpportunityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!opportunityToDelete) return;
    
    try {
      await api.delete(`/opportunities/${opportunityToDelete}`);
      toast.success("Opportunity deleted successfully");
      fetchOpportunities();
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      toast.error("Failed to delete opportunity");
    } finally {
      setIsDeleteModalOpen(false);
      setOpportunityToDelete(null);
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Opportunities Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and publish career opportunities.</p>
        </div>
        <Link href="/admin/opportunities/create" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Opportunity
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Company & Location</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No opportunities found. Click "Add Opportunity" to create one.
                  </td>
                </tr>
              ) : (
                opportunities.map((opp: any) => (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{opp.title}</div>
                      <div className="text-slate-500 text-xs mt-1 truncate max-w-[200px]" title={opp.applyLink}>{opp.applyLink}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800">{opp.company}</div>
                      <div className="text-xs text-slate-400 mt-1">{opp.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{opp.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={opp.status === "Open" ? "default" : "secondary"} className={opp.status === "Open" ? "bg-emerald-500" : ""}>
                        {opp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/opportunities/edit/${opp.id}`} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => confirmDelete(opp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Opportunity"
        description="Are you sure you want to delete this opportunity? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
