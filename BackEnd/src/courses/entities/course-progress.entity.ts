export interface CourseProgress {
  id: string; // `${userId}_${courseId}`
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCertificate {
  id: string; // `cert_course_${courseId}_${userId}`
  courseId: string;
  courseTitle: string;
  userId: string;
  recipientName: string;
  recipientEmail: string;
  certificateNumber: string;
  issuedDate: Date;
  issuer: string;
  ceoName: string;
  ceoTitle: string;
  createdAt: Date;
}
