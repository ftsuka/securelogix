
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineEvent {
  time: Date;
  event: string;
}

interface IncidentTimelineProps {
  timeline?: TimelineEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Linha do Tempo</h3>
      <div className="space-y-4">
        {timeline.map((event, index) => (
          <div key={index} className="flex gap-3">
            <div className="mt-1 relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <div>
              <p className="font-medium">{event.event}</p>
              <p className="text-sm text-muted-foreground">
                {format(event.time, "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
