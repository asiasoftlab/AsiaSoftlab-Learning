export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points?: number;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  score: number; // percentage, e.g. 88
  pointsEarned: number;
  totalPoints: number;
  passed: boolean;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  attemptNumber: number;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  timeSpentSeconds?: number;
  completedAt?: Date;
  lastAttemptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  title: string;
  courseId?: string;
  courseTitle: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  durationMinutes: number; // e.g. 30
  passingScore: number; // e.g. 70
  maxAttempts: number; // e.g. 3
  totalQuestions: number;
  questions: AssessmentQuestion[];
  status: 'Published' | 'Draft' | 'Archived';
  // Aggregate stats or user-state metadata (populated for listing)
  userStatus?: 'not_started' | 'in_progress' | 'completed' | 'failed';
  userScore?: number;
  userAttempts?: number;
  userProgress?: number; // percentage progress e.g. 75
  lastAttemptedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
