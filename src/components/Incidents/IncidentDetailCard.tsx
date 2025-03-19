
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IncidentCardHeader } from './IncidentCardHeader';
import { IncidentDescription } from './IncidentDescription';
import { IncidentMetadata } from './IncidentMetadata';
import { IncidentAssignee } from './IncidentAssignee';
import { IncidentAffectedSystems } from './IncidentAffectedSystems';
import { IncidentTimeline } from './IncidentTimeline';
import { IncidentSeverity, IncidentStatus, IncidentType } from './IncidentCard';

interface IncidentDetailCardProps {
  incident: {
    id: string;
    title: string;
    description: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    type: IncidentType;
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: {
      name: string;
      initials: string;
    };
    additionalDetails?: string;
    affectedSystems?: string[];
    timeline?: {
      time: Date;
      event: string;
    }[];
  };
}

export const IncidentDetailCard: React.FC<IncidentDetailCardProps> = ({ incident }) => {
  return (
    <Card>
      <IncidentCardHeader 
        title={incident.title}
        severity={incident.severity}
        status={incident.status}
      />
      
      <CardContent className="space-y-6">
        <IncidentDescription 
          description={incident.description}
          additionalDetails={incident.additionalDetails}
        />
        
        <IncidentMetadata 
          createdAt={incident.createdAt}
          updatedAt={incident.updatedAt}
          type={incident.type}
        />
        
        <IncidentAssignee assignedTo={incident.assignedTo} />
        
        <IncidentAffectedSystems systems={incident.affectedSystems} />
        
        <IncidentTimeline timeline={incident.timeline} />
      </CardContent>
    </Card>
  );
};
