export class Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
