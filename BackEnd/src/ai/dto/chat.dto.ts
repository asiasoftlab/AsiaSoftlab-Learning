export class ChatDto {
  courseId: string;
  lessonId?: string;
  message: string;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}
