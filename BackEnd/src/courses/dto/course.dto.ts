export class CreateCourseDto {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  originalPrice?: number;
  instructorId?: string;
  status: 'Draft' | 'Published' | 'Unpublished';
  lessons: any[]; // will validate properly later or trust frontend for now
  learningObjectives?: string[];
}

export class UpdateCourseDto {
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  price?: number;
  originalPrice?: number;
  status?: 'Draft' | 'Published' | 'Unpublished';
  lessons?: any[];
  learningObjectives?: string[];
}

