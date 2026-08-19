export class CreateCourseDto {
  title: string;
  description: string;
  instructorId: string;
  price: number;
  imageUrl?: string;
  published: boolean;
}

export class UpdateCourseDto {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  published?: boolean;
}
