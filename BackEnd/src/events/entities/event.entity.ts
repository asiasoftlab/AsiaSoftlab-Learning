export class Event {
  id?: string;
  title: string;
  date: string; // e.g., '2024-05-20'
  time: string; // e.g., '10:00 AM - 11:30 AM'
  type: string; // e.g., 'live', 'assignment'
  createdAt?: Date;
  updatedAt?: Date;
}
