export class CreateOpportunityDto {
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  applyLink: string;
  status?: 'Open' | 'Closed';
}
