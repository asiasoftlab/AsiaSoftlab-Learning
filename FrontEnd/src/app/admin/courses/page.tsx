"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
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
          <h2 className="text-2xl font-bold text-slate-800">Course Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and publish courses for your students.</p>
        </div>
        <Link href="/admin/courses/create" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Course
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Stats</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No courses found. Click "Add Course" to create one.
                  </td>
                </tr>
              ) : (
                courses.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 bg-slate-100 rounded overflow-hidden shrink-0 relative">
                          {c.thumbnailUrl ? (
                            <Image src={c.thumbnailUrl} alt={c.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1">{c.title}</div>
                          <div className="text-slate-500 text-xs mt-1">{c.lessons?.length || 0} Lessons</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{c.category || 'Uncategorized'}</Badge>
                      <div className="text-xs text-slate-400 mt-1">{c.level || 'All Levels'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-600">₹{c.price || 0}</div>
                      {c.originalPrice && <div className="text-xs text-slate-400 line-through">₹{c.originalPrice}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={c.status === "Published" ? "default" : "secondary"} className={c.status === "Published" ? "bg-emerald-500" : ""}>
                        {c.status || "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div>⭐ {c.averageRating?.toFixed(1) || "0.0"} ({c.ratingCount || 0})</div>
                      <div>👥 {c.enrollmentCount || 0} Enrolled</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/courses/edit/${c.id}`} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteCourse(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}
