
import React from 'react';

interface IncidentAffectedSystemsProps {
  systems?: string[];
}

export const IncidentAffectedSystems: React.FC<IncidentAffectedSystemsProps> = ({ systems }) => {
  if (!systems || systems.length === 0) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Sistemas Afetados</h3>
      <ul className="list-disc list-inside text-muted-foreground space-y-1">
        {systems.map((system, index) => (
          <li key={index}>{system}</li>
        ))}
      </ul>
    </div>
  );
};
