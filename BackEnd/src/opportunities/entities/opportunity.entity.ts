export class Opportunity {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: string; // e.g., 'Full-time', 'Internship'
  applyLink: string;
  status: 'Open' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}
