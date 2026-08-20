"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, Plus, ArrowLeft, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CreateCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [level, setLevel] = useState("Beginner");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [status, setStatus] = useState("Draft");

  // Media State
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Lessons State
  const [lessons, setLessons] = useState<any[]>([]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        id: Math.random().toString(36).substring(7),
        title: "",
        description: "",
        youtubeUrl: "",
        duration: "",
        order: lessons.length + 1,
      }
    ]);
  };

  const updateLesson = (index: number, field: string, value: string) => {
    const newLessons = [...lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setLessons(newLessons);
  };

  const removeLesson = (index: number) => {
    const newLessons = lessons.filter((_, i) => i !== index);
    setLessons(newLessons.map((l, i) => ({ ...l, order: i + 1 })));
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image.");
      return;
    }

    try {
      setSaving(true);

      // Process lessons
      const processedLessons = lessons.map(l => ({
        ...l,
        youtubeVideoId: extractYoutubeId(l.youtubeUrl) || ""
      }));

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      if (originalPrice) formData.append("originalPrice", originalPrice);
      formData.append("status", status);
      formData.append("lessons", JSON.stringify(processedLessons));
      formData.append("thumbnail", thumbnailFile);

      await api.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Course created successfully!");

      router.push("/admin/courses");
    } catch (error) {
      console.error("Failed to create course", error);
      toast.error("Failed to create course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Create New Course</h2>
          <p className="text-sm text-slate-500 mt-1">Add details, upload thumbnail, and attach lessons.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column: Basic Info & Lessons */}
        <div className="xl:col-span-2 space-y-6">

          {/* Basic Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3">Basic Information</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Course Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-900 cursor-pointer" placeholder="e.g. Full Stack Web Development" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Course Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-900 cursor-pointer" placeholder="Write a detailed description..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm outline-none text-slate-900 focus:ring-brand-500 focus:border-brand-500 cursor-pointer">
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>UI/UX Design</option>
                  <option>Drone Survey & Mapping</option>
                  <option>Agriculture Drones</option>
                  <option>Underwater ROV</option>
                  <option>Data Science</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm outline-none text-slate-900 focus:ring-brand-500 focus:border-brand-500 cursor-pointer">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>All Levels</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lessons Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-lg text-slate-800">Course Curriculum</h3>
              <button type="button" onClick={addLesson} className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer">
                <Plus className="h-4 w-4" /> Add Lesson
              </button>
            </div>

            <div className="space-y-4">
              {lessons.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                  No lessons added yet. Click "Add Lesson" to start building your curriculum.
                </div>
              ) : (
                lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 relative group">
                    <div className="absolute top-4 left-3 text-slate-400 cursor-grab">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <button type="button" onClick={() => removeLesson(index)} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="pl-8 pr-6 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        Lesson {index + 1}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Lesson Title</label>
                          <input required value={lesson.title} onChange={(e) => updateLesson(index, "title", e.target.value)} type="text" className="w-full bg-white border border-slate-300 rounded p-2 text-sm outline-none text-slate-900 focus:ring-brand-500 focus:border-brand-500 cursor-pointer" placeholder="e.g. Intro to HTML" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Duration (e.g. 12 mins)</label>
                          <input required value={lesson.duration} onChange={(e) => updateLesson(index, "duration", e.target.value)} type="text" className="w-full bg-white border border-slate-300 rounded p-2 text-sm outline-none text-slate-900 focus:ring-brand-500 focus:border-brand-500 cursor-pointer" placeholder="e.g. 12 mins" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">YouTube URL</label>
                        <input required value={lesson.youtubeUrl} onChange={(e) => updateLesson(index, "youtubeUrl", e.target.value)} type="url" className="w-full bg-white border border-slate-300 rounded p-2 text-sm outline-none text-brand-600 focus:ring-brand-500 focus:border-brand-500 cursor-pointer" placeholder="https://youtube.com/watch?v=..." />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Pricing, Media, Publishing */}
        <div className="space-y-6">

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3">Course Media</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Thumbnail Image</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden relative bg-slate-50 transition-all hover:bg-slate-100 flex flex-col items-center justify-center min-h-[200px]">
                {thumbnailPreview ? (
                  <>
                    <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                        Replace Image
                        <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleThumbnailChange} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-8 text-slate-500 hover:text-brand-600 transition-colors">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Click to upload</span>
                    <span className="text-xs opacity-75 mt-1">JPG, PNG, WebP</span>
                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleThumbnailChange} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3">Pricing & Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Offer Price (₹)</label>
                <input required value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-emerald-600 outline-none focus:ring-brand-500 focus:border-brand-500 cursor-pointer" placeholder="e.g. 4000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Original Price (₹)</label>
                <input value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} type="number" min="0" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-400 line-through outline-none focus:ring-brand-500 focus:border-brand-500 cursor-pointer" placeholder="e.g. 8000" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm outline-none font-medium text-slate-900 focus:ring-brand-500 focus:border-brand-500 cursor-pointer">
                <option value="Draft">Draft (Hidden)</option>
                <option value="Published">Published (Live)</option>
                <option value="Unpublished">Unpublished (Archived)</option>
              </select>
            </div>
          </div>

          <button disabled={saving} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer">
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {saving ? "Saving Course..." : "Save & Publish Course"}
          </button>

        </div>
      </form>
    </div>
  );
}


