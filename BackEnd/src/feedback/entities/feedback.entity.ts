export class StudentFeedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  courseId?: string;
  courseTitle: string;
  certificateId?: string;
  certificateNumber?: string;
  rating: number; // 1 to 5 overall
  contentRating?: number; // 1 to 5
  instructorRating?: number; // 1 to 5
  practicalRating?: number; // 1 to 5
  recommendLikelihood?: 'yes' | 'maybe' | 'no';
  tags?: string[];
  feedback: string;
  isPublic?: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
