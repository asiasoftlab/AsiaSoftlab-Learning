"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { FileText, CheckCircle2, Clock, Search, Plus, Target, Edit, Trash2, Eye, Loader2, X, Upload, Award, HelpCircle, BookOpen, AlertCircle, ChevronRight, Check, Sparkles, } from "lucide-react";
import toast from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnailUrl?: string;
  status: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points?: number;
}

interface Assessment {
  id: string;
  title: string;
  courseId?: string;
  courseTitle: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  durationMinutes: number;
  passingScore: number;
  maxAttempts: number;
  totalQuestions: number;
  questions?: Question[];
  status?: "Published" | "Draft" | "Archived";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function AdminAssessmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [activeFilter, setActiveFilter] = useState<"all" | "has_assessment" | "missing_assessment">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedCourseForNew, setSelectedCourseForNew] = useState<Course | null>(null);
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

  // Form State
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formCourseId, setFormCourseId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCourseTitle, setFormCourseTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Web Development");
  const [formDescription, setFormDescription] = useState("");
  const [formDuration, setFormDuration] = useState("30");
  const [formPassingScore, setFormPassingScore] = useState("70");
  const [formMaxAttempts, setFormMaxAttempts] = useState("3");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Published");
  const [formThumbnailFile, setFormThumbnailFile] = useState<File | null>(null);
  const [formThumbnailPreview, setFormThumbnailPreview] = useState<string | null>(null);
  const [formQuestions, setFormQuestions] = useState<Question[]>([
    {
      id: "q_1",
      question: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      explanation: "",
      points: 5,
    },
  ]);

  // Preview Quiz state
  const [previewIndex, setPreviewIndex] = useState(0);

  // Fetch Courses & Assessments
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, assessmentsRes] = await Promise.all([
        api.get("/courses"),
        api.get("/assessments"),
      ]);
      setCourses(coursesRes.data || []);
      setAssessments(assessmentsRes.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load courses or assessments.");
    } finally {
      setLoading(false);
    }
  };

  // Map assessment to course
  const coursesWithAssessments = useMemo(() => {
    return courses.map((course) => {
      // Find matching assessment by courseId or courseTitle
      const assessment = assessments.find(
        (a) =>
          (a.courseId && a.courseId === course.id) ||
          (a.courseTitle && a.courseTitle.trim().toLowerCase() === course.title.trim().toLowerCase())
      );
      return {
        ...course,
        assessment: assessment || null,
      };
    });
  }, [courses, assessments]);

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [courses]);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const withAssessment = coursesWithAssessments.filter((c) => c.assessment !== null).length;
    const pendingAssessment = totalCourses - withAssessment;
    const totalQuestions = assessments.reduce(
      (sum, a) => sum + (a.totalQuestions || a.questions?.length || 0),
      0
    );
    return { totalCourses, withAssessment, pendingAssessment, totalQuestions };
  }, [courses, coursesWithAssessments, assessments]);

  // Filtered List
  const filteredList = useMemo(() => {
    return coursesWithAssessments.filter((item) => {
      // Status filter
      if (activeFilter === "has_assessment" && !item.assessment) return false;
      if (activeFilter === "missing_assessment" && item.assessment) return false;

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchCategory = item.category?.toLowerCase().includes(q);
        const matchAssessment = item.assessment?.title?.toLowerCase().includes(q);
        if (!matchTitle && !matchCategory && !matchAssessment) return false;
      }

      return true;
    });
  }, [coursesWithAssessments, activeFilter, selectedCategory, searchQuery]);

  // Open Create Modal for a Specific Course
  const handleOpenCreateForCourse = (course: Course) => {
    setSelectedCourseForNew(course);
    setFormCourseId(course.id);
    setFormCourseTitle(course.title);
    setFormTitle(`${course.title} Assessment`);
    setFormCategory(course.category || "Web Development");
    setFormDescription(course.description || `Assessment test for ${course.title}`);
    setFormDuration("30");
    setFormPassingScore("70");
    setFormMaxAttempts("3");
    setFormStatus("Published");
    setFormThumbnailFile(null);
    setFormThumbnailPreview(course.thumbnailUrl || null);
    setFormQuestions([
      {
        id: `q_${Date.now()}_1`,
        question: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        explanation: "",
        points: 5,
      },
    ]);
    setIsCreateModalOpen(true);
  };

  // Open Generic Create Modal
  const handleOpenCreateGeneric = () => {
    setSelectedCourseForNew(null);
    setFormCourseId("");
    setFormCourseTitle(courses.length > 0 ? courses[0].title : "");
    setFormTitle(courses.length > 0 ? `${courses[0].title} Assessment` : "New Assessment");
    setFormCategory(courses.length > 0 ? courses[0].category : "Web Development");
    setFormDescription("");
    setFormDuration("30");
    setFormPassingScore("70");
    setFormMaxAttempts("3");
    setFormStatus("Published");
    setFormThumbnailFile(null);
    setFormThumbnailPreview(courses.length > 0 ? courses[0].thumbnailUrl || null : null);
    setFormQuestions([
      {
        id: `q_${Date.now()}_1`,
        question: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        explanation: "",
        points: 5,
      },
    ]);
    setIsCreateModalOpen(true);
  };

  // When course changes in the create modal dropdown
  const handleSelectCourseInModal = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setFormCourseId(course.id);
      setFormCourseTitle(course.title);
      setFormTitle(`${course.title} Assessment`);
      setFormCategory(course.category || "Web Development");
      if (!formThumbnailFile && course.thumbnailUrl) {
        setFormThumbnailPreview(course.thumbnailUrl);
      }
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setFormCourseId(assessment.courseId || "");
    setFormTitle(assessment.title);
    setFormCourseTitle(assessment.courseTitle);
    setFormCategory(assessment.category);
    setFormDescription(assessment.description || "");
    setFormDuration(String(assessment.durationMinutes || 30));
    setFormPassingScore(String(assessment.passingScore || 70));
    setFormMaxAttempts(String(assessment.maxAttempts || 3));
    setFormStatus((assessment.status as any) || "Published");
    setFormThumbnailFile(null);
    setFormThumbnailPreview(assessment.thumbnailUrl || null);
    setFormQuestions(
      assessment.questions && assessment.questions.length > 0
        ? assessment.questions.map((q) => ({ ...q }))
        : [
            {
              id: `q_${Date.now()}_1`,
              question: "",
              options: ["", "", "", ""],
              correctOptionIndex: 0,
              explanation: "",
              points: 5,
            },
          ]
    );
    setIsEditModalOpen(true);
  };

  // Question builder helpers
  const addQuestion = () => {
    setFormQuestions([
      ...formQuestions,
      {
        id: `q_${Date.now()}_${formQuestions.length + 1}`,
        question: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        explanation: "",
        points: 5,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (formQuestions.length <= 1) {
      toast.error("An assessment must have at least one question.");
      return;
    }
    setFormQuestions(formQuestions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, val: string) => {
    const updated = [...formQuestions];
    updated[index].question = val;
    setFormQuestions(updated);
  };

  const updateOptionText = (qIndex: number, optIndex: number, val: string) => {
    const updated = [...formQuestions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = val;
    updated[qIndex].options = newOptions;
    setFormQuestions(updated);
  };

  const setCorrectOption = (qIndex: number, optIndex: number) => {
    const updated = [...formQuestions];
    updated[qIndex].correctOptionIndex = optIndex;
    setFormQuestions(updated);
  };

  // Save (Create / Update)
  const handleSubmitAssessment = async (e: React.FormEvent, isEdit = false) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Assessment title is required.");
      return;
    }
    if (!formCourseTitle.trim()) {
      toast.error("Course name is required.");
      return;
    }

    for (let i = 0; i < formQuestions.length; i++) {
      if (!formQuestions[i].question.trim()) {
        toast.error(`Question ${i + 1} text cannot be empty.`);
        return;
      }
      for (let j = 0; j < formQuestions[i].options.length; j++) {
        if (!formQuestions[i].options[j].trim()) {
          toast.error(`Option ${j + 1} in Question ${i + 1} cannot be empty.`);
          return;
        }
      }
    }

    try {
      setFormSubmitting(true);
      const formData = new FormData();
      formData.append("title", formTitle);
      if (formCourseId) formData.append("courseId", formCourseId);
      formData.append("courseTitle", formCourseTitle);
      formData.append("category", formCategory);
      formData.append("description", formDescription);
      formData.append("durationMinutes", formDuration);
      formData.append("passingScore", formPassingScore);
      formData.append("maxAttempts", formMaxAttempts);
      formData.append("status", formStatus);
      formData.append("questions", JSON.stringify(formQuestions));

      if (formThumbnailFile) {
        formData.append("thumbnail", formThumbnailFile);
      }

      if (isEdit && selectedAssessment) {
        await api.patch(`/assessments/${selectedAssessment.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Assessment updated successfully!");
        setIsEditModalOpen(false);
      } else {
        await api.post("/assessments", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Assessment added to course successfully!");
        setIsCreateModalOpen(false);
      }

      fetchData();
    } catch (error: any) {
      console.error("Failed to save assessment:", error);
      toast.error(error?.response?.data?.message || "Failed to save assessment.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!assessmentToDelete) return;
    try {
      await api.delete(`/assessments/${assessmentToDelete.id}`);
      toast.success("Assessment deleted successfully.");
      setIsDeleteModalOpen(false);
      setAssessmentToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete assessment:", error);
      toast.error("Failed to delete assessment.");
    }
  };

  // Open Preview
  const handleOpenPreview = async (item: Assessment) => {
    try {
      setLoading(true);
      const res = await api.get(`/assessments/${item.id}`);
      setSelectedAssessment(res.data);
      setPreviewIndex(0);
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error("Failed to preview assessment:", err);
      toast.error("Could not load assessment preview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Course Assessments</h2>
          <p className="text-sm text-slate-500 mt-1">
            List of all uploaded courses and attach quiz assessments to them.
          </p>
        </div>

        <button
          onClick={handleOpenCreateGeneric}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Assessment
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">{stats.totalCourses}</div>
            <div className="text-xs font-semibold text-slate-600">Total Uploaded Courses</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">{stats.withAssessment}</div>
            <div className="text-xs font-semibold text-slate-600">Courses with Assessment</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">{stats.pendingAssessment}</div>
            <div className="text-xs font-semibold text-slate-600">Pending Assessments</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">{stats.totalQuestions}</div>
            <div className="text-xs font-semibold text-slate-600">Total Questions Bank</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search / Category Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Courses ({stats.totalCourses})
          </button>
          <button
            onClick={() => setActiveFilter("has_assessment")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === "has_assessment"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Has Assessment ({stats.withAssessment})
          </button>
          <button
            onClick={() => setActiveFilter("missing_assessment")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === "missing_assessment"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Needs Assessment ({stats.pendingAssessment})
          </button>
        </div>

        {/* Search & Category Select */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses or assessments..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Courses with Assessment Management Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading uploaded courses...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No courses match your filter</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            {searchQuery
              ? `No courses matched "${searchQuery}".`
              : "Try adjusting your filter to view uploaded courses."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="text-sm text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold w-[35%] min-w-[240px]">Uploaded Course</th>
                  <th className="px-6 py-4 font-semibold w-[18%] min-w-[140px]">Category & Level</th>
                  <th className="px-6 py-4 font-semibold w-[20%] min-w-[160px]">Assessment Status</th>
                  <th className="px-6 py-4 font-semibold w-[17%] min-w-[150px]">Quiz Details</th>
                  <th className="px-6 py-4 font-semibold w-[17%] min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => {
                  const hasAssessment = !!item.assessment;
                  const assessment = item.assessment;
                  const qCount = assessment
                    ? assessment.totalQuestions || assessment.questions?.length || 0
                    : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Course Thumbnail & Title */}
                      <td className="px-6 py-4 max-w-[280px]">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-16 h-11 rounded-lg overflow-hidden relative bg-slate-900 flex-shrink-0 border border-slate-200 shadow-inner">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                <BookOpen className="w-4 h-4 text-brand-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="font-bold text-slate-900 text-sm truncate"
                              title={item.title}
                            >
                              {item.title}
                            </div>
                            <div
                              className="text-[12px] text-slate-400 truncate mt-0.5"
                              title={item.description || "No description provided."}
                            >
                              {item.description || "No description provided."}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Level */}
                      <td className="px-6 py-4 max-w-[160px]">
                        <div className="font-medium text-slate-800 truncate" title={item.category}>
                          {item.category}
                        </div>
                        <div className="text-[12px] text-slate-400 truncate">
                          {item.level || "All Levels"}
                        </div>
                      </td>

                      {/* Assessment Attached Status */}
                      <td className="px-6 py-4 max-w-[180px]">
                        {hasAssessment ? (
                          <div className="space-y-1 min-w-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              
                              Assessment Active
                            </span>
                            <div
                              className="text-[12px] font-medium text-slate-700 truncate"
                              title={assessment?.title}
                            >
                              {assessment?.title}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            No Assessment Added
                          </span>
                        )}
                      </td>

                      {/* Quiz Details */}
                      <td className="px-6 py-4">
                        {hasAssessment && assessment ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800">
                              {qCount} Questions • {assessment.durationMinutes || 30} Mins
                            </div>
                            <div className="text-[12px] text-slate-500">
                              Pass Target : <strong className="text-slate-700">{assessment.passingScore || 70}%</strong>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Not configured</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {hasAssessment && assessment ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenPreview(assessment)}
                              title="Preview Assessment Quiz"
                              className="inline-flex items-center border border-slate-500 gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              Preview
                            </button>
                            <button
                              onClick={() => handleOpenEdit(assessment)}
                              title="Edit Assessment & Questions"
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setAssessmentToDelete(assessment);
                                setIsDeleteModalOpen(true);
                              }}
                              title="Delete Assessment"
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenCreateForCourse(item)}
                            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                            Add Assessment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== CREATE / EDIT ASSESSMENT MODAL ===================== */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-3">
                
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {isEditModalOpen ? "Edit Assessment" : "Add Assessment to Course"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure passing parameters and add multiple-choice questions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => handleSubmitAssessment(e, isEditModalOpen)}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Course Dropdown */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Attached Course *
                  </label>
                  <select
                    value={formCourseId}
                    onChange={(e) => handleSelectCourseInModal(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none bg-white"
                  >
                    <option value="">-- Choose from uploaded courses --</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assessment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Frontend Development Assessment"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Display Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCourseTitle}
                    onChange={(e) => setFormCourseTitle(e.target.value)}
                    placeholder="e.g. Web Development Fundamentals"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Web Development, Programming, Data Science"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of what this assessment covers..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Passing Score (%) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={formPassingScore}
                    onChange={(e) => setFormPassingScore(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Attempts Allowed *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formMaxAttempts}
                    onChange={(e) => setFormMaxAttempts(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Thumbnail Image */}
              <div className="border-t border-slate-200 pt-4">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Thumbnail Image (Course Thumbnail or Upload Custom)
                </label>
                <div className="flex items-center gap-4">
                  {formThumbnailPreview ? (
                    <div className="w-28 h-18 rounded-lg overflow-hidden relative border border-slate-300 bg-slate-100 flex-shrink-0">
                      <Image
                        src={formThumbnailPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-18 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 flex-shrink-0 text-xs">
                      <Upload className="w-5 h-5 mb-1" />
                      <span>No image</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-slate-300">
                      <Upload className="w-4 h-4" />
                      Upload Custom Thumbnail
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setFormThumbnailFile(file);
                            setFormThumbnailPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Defaults to the selected course image or upload a custom one to Cloudinary.
                    </p>
                  </div>
                </div>
              </div>

              {/* Question Builder */}
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Assessment Questions ({formQuestions.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add multiple-choice questions and select the correct answer.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-brand-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {formQuestions.map((q, qIndex) => (
                    <div
                      key={q.id || qIndex}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                          Question {qIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Remove Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={q.question}
                          onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                          placeholder={`Enter question text...`}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                        />
                      </div>

                      {/* Options Grid */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Options (Select the correct answer):
                        </span>
                        {q.options.map((opt, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                              q.correctOptionIndex === optIndex
                                ? "bg-emerald-50/70 border-emerald-300"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${qIndex}`}
                              checked={q.correctOptionIndex === optIndex}
                              onChange={() => setCorrectOption(qIndex, optIndex)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-500 w-4">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              className="flex-1 px-2.5 py-1 text-xs bg-transparent focus:outline-none text-slate-800"
                            />
                            {q.correctOptionIndex === optIndex && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isEditModalOpen ? "Save Changes" : "Save Assessment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== PREVIEW QUIZ MODAL ===================== */}
      {isPreviewModalOpen && selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-600 text-[10px] font-bold uppercase tracking-wider">
                    Admin Preview
                  </span>
                  <h2 className="text-base font-bold">{selectedAssessment.title}</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedAssessment.courseTitle}</p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {selectedAssessment.questions && selectedAssessment.questions[previewIndex] ? (
                (() => {
                  const q = selectedAssessment.questions[previewIndex];
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>
                          Question {previewIndex + 1} of {selectedAssessment.questions.length}
                        </span>
                        <span>{q.points || 5} Points</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{q.question}</h3>

                      <div className="space-y-2.5 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = q.correctOptionIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border flex items-center justify-between ${
                                isCorrect
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                                  : "bg-white border-slate-200 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-3 text-xs">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isCorrect
                                      ? "bg-emerald-600 text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isCorrect && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Correct Answer
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                          <strong className="text-slate-800">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No questions configured for this assessment yet.
                </div>
              )}

              {/* Preview Pager */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  disabled={previewIndex === 0}
                  onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>

                <button
                  disabled={previewIndex >= (selectedAssessment.questions?.length || 1) - 1}
                  onClick={() => setPreviewIndex((prev) => prev + 1)}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {isDeleteModalOpen && assessmentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Assessment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete &quot;{assessmentToDelete.title}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAssessmentToDelete(null);
                }}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-all shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
