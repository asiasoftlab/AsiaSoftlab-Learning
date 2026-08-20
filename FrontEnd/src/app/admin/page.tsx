"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, ShieldCheck, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  role: string;
  createdAt?: string;
}

interface Course {
  id: string;
  published: boolean;
  createdAt?: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          api.get("/users"),
          api.get("/courses")
        ]);
        setUsers(usersRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const students = users.filter(u => u.role === "student").length;
  const instructors = users.filter(u => u.role === "instructor").length;
  const admins = users.filter(u => u.role === "admin").length;
  const publishedCourses = courses.filter(c => c.published).length;
  const draftCourses = courses.length - publishedCourses;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h2>

      {/* Top Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-slate-600">Total Users</CardTitle>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{users.length}</div>
            <p className="text-sm text-slate-500 mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-slate-600">Total Courses</CardTitle>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shadow-inner">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{courses.length}</div>
            <p className="text-sm text-slate-500 mt-1">Available on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-slate-600">Active Instructors</CardTitle>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-6 h-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{instructors}</div>
            <p className="text-sm text-slate-500 mt-1">Teaching courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-slate-600">Published Content</CardTitle>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{publishedCourses}</div>
            <p className="text-sm text-slate-500 mt-1">{draftCourses} drafts pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Content Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Content Status</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Published Courses</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{publishedCourses}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(publishedCourses / Math.max(courses.length, 1)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Drafts</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{draftCourses}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                <div className="bg-slate-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${(draftCourses / Math.max(courses.length, 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
