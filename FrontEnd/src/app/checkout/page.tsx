"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api, getApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  Star,
  Users,
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  Building,
  Wallet,
  Loader2,
  Check,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseData {
  id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  price: number;
  originalPrice?: number;
  thumbnailUrl?: string;
  totalDuration?: string;
  instructorId?: string;
  averageRating?: number;
  ratingCount?: number;
  enrollmentCount?: number;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams?.get("courseId");

  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

  // Course state
  const [course, setCourse] = useState<CourseData | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  // Student form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  // Payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Load user data into form
  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  // Fetch course and enrollment status
  useEffect(() => {
    if (!courseId) {
      setIsLoadingCourse(false);
      return;
    }

    const fetchCourseAndStatus = async () => {
      try {
        setIsLoadingCourse(true);
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.data);

        // Check if student is already enrolled
        if (isAuthenticated) {
          try {
            const checkRes = await api.get(`/payments/check/${courseId}`);
            if (checkRes.data?.isEnrolled) {
              setIsAlreadyEnrolled(true);
            }
          } catch (e) {
            // Ignore if check fails
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch course details:", err);
        toast.error("Unable to load course details. Please try again.");
      } finally {
        setIsLoadingCourse(false);
      }
    };

    fetchCourseAndStatus();
  }, [courseId, isAuthenticated]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required for Razorpay checkout";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    setPaymentError(null);

    if (!isAuthenticated) {
      toast.error("Please sign in to proceed with course enrollment");
      router.push(`/login?redirect=/checkout?courseId=${courseId}`);
      return;
    }

    if (!course) {
      toast.error("Invalid course selected");
      return;
    }

    if (isAlreadyEnrolled) {
      toast.success("You are already enrolled in this course!");
      router.push(`/courses/${course.id}`);
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all student information fields correctly");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay payment SDK failed to load. Check your internet connection.");
      }

      // 2. Create Razorpay order on backend
      const orderPayload = {
        courseId: course.id,
        studentName: name.trim(),
        studentEmail: email.trim(),
        studentPhone: phone.trim(),
      };

      const orderResponse = await api.post("/payments/create-order", orderPayload);
      const { orderId, amount, currency, keyId } = orderResponse.data;

      // 3. Configure Razorpay options
      const options = {
        key: keyId,
        amount: amount, // in paise
        currency: currency || "INR",
        name: "Asia Softlab Virtual Academy",
        description: `Enrollment for ${course.title}`,
        image: "/Home/logo_ASVA.png",
        order_id: orderId,
        handler: async function (response: any) {
          // Trigger backend verification
          setVerifyingPayment(true);
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course.id,
              studentName: name.trim(),
              studentEmail: email.trim(),
              studentPhone: phone.trim(),
            };

            const verifyResponse = await api.post("/payments/verify", verifyPayload);

            setVerifyingPayment(false);
            setPaymentSuccess({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              enrollment: verifyResponse.data.enrollment,
            });
            setIsAlreadyEnrolled(true);
            toast.success("Payment verified! Welcome to the course 🎉");
          } catch (verifyErr: any) {
            setVerifyingPayment(false);
            const errMsg = getApiError(verifyErr) || "Payment signature verification failed.";
            setPaymentError(errMsg);
            toast.error(errMsg);
          }
        },
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        notes: {
          courseId: course.id,
          courseTitle: course.title,
        },
        theme: {
          color: "#1169aa",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast("Payment window closed", { icon: "ℹ️" });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (failResponse: any) {
        setIsProcessing(false);
        const reason = failResponse?.error?.description || "Payment failed or was declined.";
        setPaymentError(reason);
        toast.error(reason);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      const msg = getApiError(err);
      setPaymentError(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Price calculations matching courses/[id]/page.tsx
  const coursePrice = Number(course?.price) || 0;
  const hasDiscount = Boolean(course?.originalPrice && course.originalPrice > coursePrice);
  const originalPrice = hasDiscount ? Number(course?.originalPrice) : 0;
  const discountAmount = hasDiscount ? originalPrice - coursePrice : 0;
  const discountPercent = hasDiscount ? Math.round((discountAmount / originalPrice) * 100) : 0;
  const taxInclusive = Math.round(coursePrice * (18 / 118)); // 18% GST portion

  if (isLoadingCourse || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Course Selected</h2>
          <p className="text-slate-500 text-sm mb-6">
            Please choose an active course from our academy catalog to continue with enrollment.
          </p>
          <Link href="/courses">
            <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl">
              Browse All Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      {/* Verification Overlay */}
      {verifyingPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 flex flex-col items-center">
            <div className="h-16 w-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-5">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Verifying Payment</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              We are securely validating your transaction with Razorpay and activating your course enrollment.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              Do not refresh or close this window
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6">
        {/* Back Link */}
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course Details
        </Link>

        {/* Success Screen */}
        {paymentSuccess ? (
          <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-8 md:p-12 text-center max-w-2xl mx-auto">
            <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 mb-3 border border-emerald-200">
               Enrollment Confirmed
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Welcome to the Course!
            </h1>
            <p className="text-slate-600 mb-8 text-base">
              Your payment has been successfully verified via Razorpay. You now have lifetime access to{" "}
              <strong className="text-slate-900">{course.title}</strong>.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-200 text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500">Transaction Status</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Paid & Active
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Razorpay Payment ID</span>
                <span className="font-mono font-medium text-slate-800">{paymentSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono font-medium text-slate-800">{paymentSuccess.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 font-semibold">
                <span className="text-slate-800">Amount Paid</span>
                <span className="text-emerald-600 text-sm">₹{coursePrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/courses/${course.id}`} className="w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  Start Learning Now <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/dashboard/courses" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto py-3.5 px-6 rounded-xl border-slate-300 hover:bg-slate-100 font-semibold text-slate-700">
                  Go to My Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Course Info & Student Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Page Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Course Checkout
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Complete your enrollment securely through Asia Softlab Virtual Academy.
                </p>
              </div>

              {/* Already Enrolled Notice */}
              {isAlreadyEnrolled && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-emerald-900 text-base">You are already enrolled!</h4>
                    <p className="text-emerald-700 text-sm mt-0.5">
                      You already have full access to this course and its materials.
                    </p>
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline mt-2"
                    >
                      Continue to Course Lessons <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {paymentError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm text-rose-800">
                    <span className="font-bold">Payment Issue: </span>
                    {paymentError}
                  </div>
                </div>
              )}

              {/* Selected Course Card (matches courses/[id] theme) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                    {course.category || "Uncategorized"}
                  </span>
                  <span className="bg-brand-50 text-brand-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                    {course.level || "All Levels"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-52 h-32 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 208px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="h-10 w-10" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
                      {course.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
                      {(course.averageRating || 0) > 0 && (
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{(course.averageRating || 0).toFixed(1)}</span>
                          <span className="text-slate-400 font-normal">({course.ratingCount || 0})</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>{course.enrollmentCount || 0} Enrolled</span>
                      </div>
                      {course.totalDuration && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{course.totalDuration}</span>
                        </div>
                      )}
                    </div>

                    {course.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-2.5">
                        {course.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Course Benefits List */}
                <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-brand-500 shrink-0" />
                    <span>Full lifetime access to video curriculum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-brand-500 shrink-0" />
                    <span>Official verified certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-brand-500 shrink-0" />
                    <span>Downloadable resources & practice docs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-500 shrink-0" />
                    <span>Community discussions & guidance</span>
                  </div>
                </div>
              </div>

              {/* Student Information Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-brand-600" />
                    Student Information
                  </h3>
                  {!isAuthenticated && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md font-medium">
                      Sign in required
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Please confirm your details. Your course access, completion certificate, and Razorpay receipt will be issued to this student profile.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Legal Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-all ${
                            errors.name
                              ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                              : "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white"
                          }`}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone Number (Required for Razorpay OTP/UPI) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold shrink-0">
                          🇮🇳 +91
                        </span>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            value={phone}
                            maxLength={12}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            placeholder="98765 43210"
                            className={`w-full rounded-r-lg border pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-all ${
                              errors.phone
                                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                                : "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white"
                            }`}
                          />
                        </div>
                      </div>
                      {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="student@example.com"
                        className={`w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition-all ${
                          errors.email
                            ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                            : "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>

                  
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (matches Action Card on courses/[id]) */}
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <h3 className="font-bold text-slate-800 text-lg">Order Summary</h3>
                  <span className="text-xs font-medium text-slate-400">1 Course</span>
                </div>

                {/* Price Display */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-3xl font-bold text-emerald-600">₹{coursePrice}</div>
                  {hasDiscount && (
                    <>
                      <div className="text-lg text-slate-400 line-through">₹{originalPrice}</div>
                      <div className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-md">
                        {discountPercent}% OFF
                      </div>
                    </>
                  )}
                </div>

                {/* Itemized Breakdown */}
                <div className="space-y-3 text-sm pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Course Price</span>
                    <span className="font-semibold text-slate-800">
                      {hasDiscount ? `₹${originalPrice}` : `₹${coursePrice}`}
                    </span>
                  </div>

                  {hasDiscount && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="text-xs font-semibold">Special Discount</span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500 text-xs">
                    <span>Included Taxes (18% GST)</span>
                    <span>₹{taxInclusive}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <div>
                      <div className="text-base font-bold text-slate-900">Total Payable</div>
                      <div className="text-[11px] text-slate-400 font-normal">All taxes included</div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ₹{coursePrice}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isAlreadyEnrolled ? (
                    <Link href={`/courses/${course.id}`} className="block">
                      <button className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                        <CheckCircle2 className="h-4 w-4" /> Go to Course Lessons
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={handleProceedToPayment}
                      disabled={isProcessing || verifyingPayment}
                      className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Opening Razorpay...
                        </>
                      ) : (
                        <>
                          Proceed to Payment <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Payment Options Supported */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                    Supported Payment Options
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-slate-600 font-medium">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-1 flex flex-col items-center">
                      <span className="font-extrabold text-indigo-600">UPI</span>
                      <span className="text-[9px] text-slate-400">GPay/PhonePe</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-1 flex flex-col items-center">
                      <CreditCard className="h-3.5 w-3.5 text-emerald-600 mb-0.5" />
                      <span>Cards</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-1 flex flex-col items-center">
                      <Building className="h-3.5 w-3.5 text-sky-600 mb-0.5" />
                      <span>NetBanking</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-1 flex flex-col items-center">
                      <Wallet className="h-3.5 w-3.5 text-amber-600 mb-0.5" />
                      <span>Wallets</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 pt-4 text-center">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Secure payment powered by Razorpay</span>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
