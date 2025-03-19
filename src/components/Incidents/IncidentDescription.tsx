
import React from 'react';

interface IncidentDescriptionProps {
  description: string;
  additionalDetails?: string;
}

export const IncidentDescription: React.FC<IncidentDescriptionProps> = ({
  description,
  additionalDetails
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Descrição</h3>
      <p className="text-muted-foreground">{description}</p>
      {additionalDetails && (
        <p className="text-muted-foreground mt-2">{additionalDetails}</p>
      )}
    </div>
  );
};
