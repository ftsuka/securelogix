
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IncidentSeverity, IncidentStatus, IncidentType } from '@/components/Incidents/types';
import { getSeverityIcon, getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel } from './IncidentDetailUtils';

interface IncidentCardHeaderProps {
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
}

export const IncidentCardHeader: React.FC<IncidentCardHeaderProps> = ({
  title,
  severity,
  status,
  type
}) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          {getSeverityIcon(severity)}
          <CardTitle>{title}</CardTitle>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={`px-3 py-1.5 text-sm ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-1">
            {getTypeIcon(type)}
            <span>{getTypeLabel(type)}</span>
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
};
