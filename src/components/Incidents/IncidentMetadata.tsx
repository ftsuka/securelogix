
import React from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IncidentType } from './types';
import { getTypeIcon, getTypeLabel } from './IncidentDetailUtils';

interface IncidentMetadataProps {
  createdAt: Date;
  updatedAt: Date;
  type: IncidentType;
}

export const IncidentMetadata: React.FC<IncidentMetadataProps> = ({
  createdAt,
  updatedAt,
  type
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Criado em</p>
          <p className="font-medium">{format(createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Última atualização</p>
          <p className="font-medium">{format(updatedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tipo</p>
          <div className="flex items-center gap-1">
            {getTypeIcon(type)}
            <span className="font-medium">{getTypeLabel(type)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
