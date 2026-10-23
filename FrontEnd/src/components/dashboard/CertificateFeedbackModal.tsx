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
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-xs sm:text-sm font-bold tracking-tight truncate">Course & Certificate Feedback</h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
              {data.courseTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          /* ================= SUCCESS CELEBRATION VIEW ================= */
          <div className="p-4 sm:p-6 text-center space-y-4 overflow-y-auto">
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Thank You, {user?.displayName || "Learner"}!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your feedback has been successfully recorded. Your thoughts help ASVA maintain world-class curriculum standards.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-w-sm mx-auto text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Certificate:</span>
                <span className="font-mono font-bold text-slate-800">{data.certificateNumber || "Verified"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Overall Rating:</span>
                <span className="font-semibold text-amber-600 flex items-center gap-1">
                  {"★".repeat(rating)} <span className="text-slate-700">({rating}/5)</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onClose}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Done
              </button>
            </div>
          </div>
        ) : (
          /* ================= FEEDBACK FORM VIEW ================= */
          <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto">
            {loadingExisting && (
              <div className="flex items-center gap-2 text-[11px] text-brand-600 bg-brand-50 p-2 rounded-lg border border-brand-200">
                <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                <span>Loading your existing feedback for this certificate...</span>
              </div>
            )}

            {/* 1. Overall Star Rating */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 text-center space-y-2">
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide block">
                How would you rate this course overall?
              </label>

              {/* Interactive Stars */}
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-400 drop-shadow-2xs"
                            : "text-slate-300 hover:text-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Rating Label */}
              <div className="text-xs font-semibold">
                <span className={`font-semibold ${currentLabel.color}`}>
                  {currentLabel.text}
                </span>{" "}
                <span className="text-slate-500 font-normal">: {currentLabel.desc}</span>
              </div>
            </div>

            {/* 2. Detailed Dimension Ratings */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Detailed Evaluation
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Content Quality */}
                <div className="bg-white border border-slate-200/90 rounded-md p-2.5 flex sm:flex-col justify-between items-center sm:items-start">
                  <span className="text-xs font-medium text-slate-700">Course Content</span>
                  <div className="flex items-center gap-0.5 sm:mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setContentRating(s)}
                        className={`text-base p-0.5 font-bold cursor-pointer ${
                          contentRating >= s ? "text-amber-500" : "text-slate-200"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Practical Knowledge */}
                <div className="bg-white border border-slate-200/90 rounded-md p-2.5 flex sm:flex-col justify-between items-center sm:items-start">
                  <span className="text-xs font-medium text-slate-700">Practical Projects</span>
                  <div className="flex items-center gap-0.5 sm:mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPracticalRating(s)}
                        className={`text-base p-0.5 font-bold cursor-pointer ${
                          practicalRating >= s ? "text-amber-500" : "text-slate-200"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instruction Quality */}
                <div className="bg-white border border-slate-200/90 rounded-md p-2.5 flex sm:flex-col justify-between items-center sm:items-start">
                  <span className="text-xs font-medium text-slate-700">Mentorship</span>
                  <div className="flex items-center gap-0.5 sm:mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setInstructorRating(s)}
                        className={`text-base p-0.5 font-bold cursor-pointer ${
                          instructorRating >= s ? "text-amber-500" : "text-slate-200"
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
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                What did you like most?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {HIGHLIGHT_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[10px] sm:text-[11px] px-2 py-1 rounded-md border font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-brand-50 border-brand-500 text-brand-700 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-brand-600 shrink-0" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Recommendation Choice */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Would you recommend this course?
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "yes", label: "Definitely Yes" },
                  { id: "maybe", label: "Maybe" },
                  { id: "no", label: "Not Likely" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRecommendLikelihood(opt.id as any)}
                    className={`py-1.5 px-2 text-[10px] sm:text-[11px] font-semibold rounded-md border transition-all cursor-pointer text-center truncate ${
                      recommendLikelihood === opt.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Written Feedback */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Review & Suggestions
                </label>
                <span className="text-[10px] text-slate-400">
                  {feedbackText.length}/500
                </span>
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="What did you learn? What was your favorite part?"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400 resize-none"
                required
              />
            </div>

            {/* 6. Consent to feature as Testimonial */}
            <div className="flex items-start gap-2 pt-0.5">
              <input
                type="checkbox"
                id="isPublicConsent"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer shrink-0"
              />
              <label
                htmlFor="isPublicConsent"
                className="text-[10px] sm:text-[11px] text-slate-600 cursor-pointer select-none leading-tight"
              >
                Allow ASVA to feature this review on student testimonials
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !feedbackText.trim()}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit
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
