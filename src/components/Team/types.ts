
export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  image_url?: string;
  role: string;
  email: string;
  phone: string;
  assignedIncidents: number;
  resolvedIncidents: number;
  status: 'available' | 'busy' | 'offline';
}
