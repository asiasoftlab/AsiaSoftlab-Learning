export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  duration: string;
  order: number;
  documents?: {
    id: string;
    title: string;
    filename: string;
    fileKey: string;
    fileType: string;
    size: number;
  }[];
}

export class Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  originalPrice?: number;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  status: 'Draft' | 'Published' | 'Unpublished';
  totalDuration: string;
  averageRating: number;
  ratingCount: number;
  enrollmentCount: number;
  instructorId: string;
  lessons: CourseLesson[];
  learningObjectives?: string[];
  createdAt: Date;
  updatedAt: Date;
}

