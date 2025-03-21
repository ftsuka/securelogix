
import React from 'react';
import { IncidentCard } from './IncidentCard';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { Incident } from './types';

interface IncidentContentProps {
  loading: boolean;
  filteredIncidents: Incident[];
  resetFilters: () => void;
}

export const IncidentContent: React.FC<IncidentContentProps> = ({
  loading,
  filteredIncidents,
  resetFilters
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando incidentes...</span>
      </div>
    );
  }

  if (filteredIncidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg">Nenhum incidente encontrado</h3>
        <p className="text-muted-foreground max-w-md mt-1">
          Não há incidentes que correspondam aos filtros selecionados. Tente ajustar seus filtros ou criar um novo incidente.
        </p>
        <Button className="mt-4 gap-2" variant="outline" onClick={resetFilters}>
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredIncidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          id={incident.id}
          title={incident.title}
          description={incident.description}
          severity={incident.severity}
          status={incident.status}
          type={incident.type}
          createdAt={incident.createdAt!}
          updatedAt={incident.updatedAt!}
          assignedTo={incident.assignedTo}
        />
      ))}
    </div>
  );
};
