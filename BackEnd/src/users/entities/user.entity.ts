export class User {
  id: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
