
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IncidentCardHeader } from './IncidentCardHeader';
import { IncidentDescription } from './IncidentDescription';
import { IncidentMetadata } from './IncidentMetadata';
import { IncidentAssignee } from './IncidentAssignee';
import { IncidentAffectedSystems } from './IncidentAffectedSystems';
import { IncidentTimeline } from './IncidentTimeline';
import { IncidentDetailContent } from './IncidentDetailContent';
import { Incident } from './types';

interface IncidentDetailCardProps {
  incident: Incident;
}

export const IncidentDetailCard: React.FC<IncidentDetailCardProps> = ({ incident }) => {
  return (
    <Card>
      <IncidentCardHeader 
        title={incident.title}
        severity={incident.severity}
        status={incident.status}
        type={incident.type}
      />
      
      <CardContent className="space-y-6">
        <IncidentDetailContent incident={incident} />
      </CardContent>
    </Card>
  );
};
