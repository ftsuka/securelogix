
import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Assignee {
  name: string;
  initials: string;
}

interface IncidentAssigneeProps {
  assignedTo?: Assignee;
}

export const IncidentAssignee: React.FC<IncidentAssigneeProps> = ({ assignedTo }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Responsável</h3>
      {assignedTo ? (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{assignedTo.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{assignedTo.name}</p>
            <p className="text-sm text-muted-foreground">Analista de Segurança</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <p className="text-muted-foreground">Não atribuído</p>
        </div>
      )}
    </div>
  );
};
