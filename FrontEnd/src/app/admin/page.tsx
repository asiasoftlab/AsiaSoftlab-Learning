"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, ShieldCheck, CheckCircle2, FileText, Loader2, Briefcase, Mail } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

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

interface Opportunity {
  id: string;
  title?: string;
}

interface Subscriber {
  id: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, coursesRes, opportunitiesRes, subscribersRes] = await Promise.all([
          api.get("/users"),
          api.get("/courses"),
          api.get("/opportunities"),
          api.get("/newsletter/subscribers").catch(() => ({ data: [] })),
        ]);
        setUsers(usersRes.data || []);
        setCourses(coursesRes.data || []);
        setOpportunities(opportunitiesRes.data || []);
        setSubscribers(subscribersRes.data || []);
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

  const publishedCourses = courses.filter(c => c.published).length;
  const draftCourses = courses.length - publishedCourses;
  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;

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
            <p className="text-sm text-slate-500 mt-1">{publishedCourses} published, {draftCourses} drafts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium text-slate-600">Opportunities</CardTitle>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shadow-inner">
              <Briefcase className="w-6 h-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{opportunities.length}</div>
            <p className="text-sm text-slate-500 mt-1">Active listings</p>
          </CardContent>
        </Card>

        <Link href="/admin/newsletter" className="block">
          <Card className="hover:border-brand-300 transition-all cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium text-slate-600">Newsletter</CardTitle>
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shadow-inner">
                <Mail className="w-6 h-6 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{subscribers.length}</div>
              <p className="text-sm text-slate-500 mt-1">{activeSubscribers} active subscribers</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
