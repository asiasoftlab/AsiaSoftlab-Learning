"use client";

import React, { useState, useEffect } from "react";
import { Star, X, MessageSquare, Sparkles, CheckCircle2, ThumbsUp, Award, Send, Loader2, Check, Heart, } from "lucide-react";
import { api, getApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export interface FeedbackData {
  courseTitle: string;
  courseId?: string;
  certificateId?: string;
  certificateNumber?: string;
}

interface CertificateFeedbackModalProps {
  data: FeedbackData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const HIGHLIGHT_TAGS = [
  "Practical Knowledge",
  "Clear Explanations",
  "Career Booster",
  "Well-Structured Curriculum",
  "High Quality Certificate",
  "Engaging Material",
  "Great Mentorship",
  "Real-World Projects",
];

const RATING_LABELS: Record<number, { text: string; color: string; desc: string }> = {
  1: { text: "Poor", color: "text-red-500", desc: "Did not meet expectations" },
  2: { text: "Fair", color: "text-amber-500", desc: "Needs some improvement" },
  3: { text: "Good", color: "text-yellow-600", desc: "Met my learning expectations" },
  4: { text: "Very Good", color: "text-blue-600", desc: "Very valuable & practical" },
  5: { text: "Outstanding!", color: "text-emerald-600", desc: "Exceeded all my expectations" },
};

export function CertificateFeedbackModal({
  data,
  isOpen,
  onClose,
  onSuccess,
}: CertificateFeedbackModalProps) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [contentRating, setContentRating] = useState<number>(5);
  const [practicalRating, setPracticalRating] = useState<number>(5);
  const [instructorRating, setInstructorRating] = useState<number>(5);
  const [recommendLikelihood, setRecommendLikelihood] = useState<"yes" | "maybe" | "no">("yes");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Practical Knowledge", "Clear Explanations"]);
  const [feedbackText, setFeedbackText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Check if feedback was already submitted
  useEffect(() => {
    if (isOpen && data.certificateNumber) {
      checkExistingFeedback();
    }
  }, [isOpen, data.certificateNumber]);

  const checkExistingFeedback = async () => {
    try {
      setLoadingExisting(true);
      const res = await api.get(`/feedback/check/${data.certificateNumber}`);
      if (res.data?.hasFeedback && res.data?.feedback) {
        const fb = res.data.feedback;
        setRating(fb.rating || 5);
        setContentRating(fb.contentRating || fb.rating || 5);
        setPracticalRating(fb.practicalRating || fb.rating || 5);
        setInstructorRating(fb.instructorRating || fb.rating || 5);
        setRecommendLikelihood(fb.recommendLikelihood || "yes");
        setSelectedTags(fb.tags || []);
        setFeedbackText(fb.feedback || "");
        setIsPublic(fb.isPublic !== false);
      }
    } catch (e) {
      // Ignore if check fails or user not logged in
    } finally {
      setLoadingExisting(false);
    }
  };

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please write a few words about your experience.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/feedback", {
        courseTitle: data.courseTitle,
        courseId: data.courseId,
        certificateId: data.certificateId,
        certificateNumber: data.certificateNumber,
        rating,
        contentRating,
        practicalRating,
        instructorRating,
        recommendLikelihood,
        tags: selectedTags,
        feedback: feedbackText.trim(),
        isPublic,
      });

      setIsSubmitted(true);
      toast.success("Thank you! Your feedback has been submitted.");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error(getApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const activeStarCount = hoverRating || rating;
  const currentLabel = RATING_LABELS[activeStarCount] || RATING_LABELS[5];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Course & Certificate Feedback</h2>
              <p className="text-xs text-slate-400 font-medium">
                {data.courseTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          /* ================= SUCCESS CELEBRATION VIEW ================= */
          <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Thank You, {user?.displayName || "Learner"}!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your feedback has been successfully recorded. Your thoughts help ASVA maintain world-class curriculum standards and empower other students.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Certificate:</span>
                <span className="font-mono font-bold text-slate-800">{data.certificateNumber || "Verified"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Overall Rating:</span>
                <span className="font-semibold text-amber-600 flex items-center gap-1">
                  {"★".repeat(rating)} <span className="text-slate-700">({rating}/5)</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onClose}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Done
              </button>
            </div>
          </div>
        ) : (
          /* ================= FEEDBACK FORM VIEW ================= */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {loadingExisting && (
              <div className="flex items-center gap-2 text-xs text-brand-600 bg-brand-50 p-2.5 rounded-lg border border-brand-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading your existing feedback for this certificate...</span>
              </div>
            )}

            {/* 1. Overall Star Rating */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider block">
                How would you rate this course overall?
              </label>

              {/* Interactive Stars */}
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-500 drop-shadow-sm"
                            : "text-slate-300 hover:text-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Rating Label */}
              <div className="text-sm font-semibold">
                <span className={`font-semibold ${currentLabel.color}`}>
                  {currentLabel.text}
                </span>{" "}
                <span className="text-slate-500">: {currentLabel.desc}</span>
              </div>
            </div>

            {/* 2. Detailed Dimension Ratings */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Detailed Evaluation
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Content Quality */}
                <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
                  <span className="text-sm font-semibold text-slate-700">Course Content</span>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setContentRating(s)}
                        className={`text-lg p-1 rounded font-bold cursor-pointer ${
                          contentRating >= s ? "text-amber-500 font-extrabold" : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Practical Knowledge */}
                <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
                  <span className="text-sm font-semibold text-slate-700">Practical Projects</span>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPracticalRating(s)}
                        className={`text-lg p-1 rounded font-bold cursor-pointer ${
                          practicalRating >= s ? "text-amber-500 font-extrabold" : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instruction Quality */}
                <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
                  <span className="text-sm font-semibold text-slate-700">Clarity & Mentorship</span>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setInstructorRating(s)}
                        className={`text-lg p-1 rounded font-bold cursor-pointer ${
                          instructorRating >= s ? "text-amber-500 font-extrabold" : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Highlight Tags */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                What did you like most? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-brand-50 border-brand-500 text-brand-700 font-bold shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Recommendation Choice */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Would you recommend this course to others?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "yes", label: "Definitely Yes " },
                  { id: "maybe", label: "Maybe / Neutral" },
                  { id: "no", label: "Not Likely" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRecommendLikelihood(opt.id as any)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                      recommendLikelihood === opt.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Written Feedback */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Review & Suggestions
                </label>
                <span className="text-[11px] text-slate-400">
                  {feedbackText.length} / 500 characters
                </span>
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="Tell us what you learned, your favorite part of the course, or how we can make it even better for future students..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            {/* 6. Consent to feature as Testimonial */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="isPublicConsent"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
              />
              <label
                htmlFor="isPublicConsent"
                className="text-xs text-slate-600 cursor-pointer select-none"
              >
                Allow ASVA to feature this review on student testimonials & course preview pages
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !feedbackText.trim()}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
