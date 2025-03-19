
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentType = 'malware' | 'phishing' | 'unauthorized-access' | 'data-breach' | 'ddos' | 'other';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  additionalDetails?: string;
  createdAt?: Date;
  updatedAt?: Date;
  assignedTo?: {
    name: string;
    initials: string;
  };
  affectedSystems?: string[];
  timeline?: {
    time: Date;
    event: string;
  }[];
}

export interface EditIncidentFormValues {
  title: string;
  description: string;
  severity: string;
  status: string;
  type: string;
  additionalDetails?: string;
}
