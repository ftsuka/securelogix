
import React from 'react';
import { IncidentDescription } from './IncidentDescription';
import { IncidentMetadata } from './IncidentMetadata';
import { IncidentAssignee } from './IncidentAssignee';
import { IncidentAffectedSystems } from './IncidentAffectedSystems';
import { IncidentTimeline } from './IncidentTimeline';
import { Incident } from './types';

interface IncidentDetailContentProps {
  incident: Incident;
}

export const IncidentDetailContent: React.FC<IncidentDetailContentProps> = ({ incident }) => {
  return (
    <>
      <IncidentDescription 
        description={incident.description}
        additionalDetails={incident.additionalDetails}
      />
      
      <IncidentMetadata 
        createdAt={incident.createdAt!}
        updatedAt={incident.updatedAt!}
        type={incident.type}
      />
      
      <IncidentAssignee assignedTo={incident.assignedTo} />
      
      <IncidentAffectedSystems systems={incident.affectedSystems} />
      
      <IncidentTimeline timeline={incident.timeline} />
    </>
  );
};
