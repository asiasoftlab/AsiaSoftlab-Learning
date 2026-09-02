export class Notification {
  id?: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'alert'; // Default info
  createdAt?: Date;
}
