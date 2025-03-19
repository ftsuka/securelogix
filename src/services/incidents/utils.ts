
import { supabase } from "@/integrations/supabase/client";
import { Incident } from "@/components/Incidents/types";

// Função auxiliar para transformar dados do Supabase em objetos Incident
export const mapDbIncidentToIncident = (incident: any, assignedTo?: any, affectedSystems?: any[], timeline?: any[]): Incident => {
  return {
    id: incident.id,
    title: incident.title,
    description: incident.description,
    severity: incident.severity,
    status: incident.status,
    type: incident.type,
    additionalDetails: incident.additional_details,
    createdAt: new Date(incident.created_at),
    updatedAt: new Date(incident.updated_at),
    assignedTo: assignedTo ? {
      name: assignedTo.name,
      initials: assignedTo.initials
    } : undefined,
    affectedSystems: affectedSystems ? affectedSystems.map(sys => sys.system_name) : [],
    timeline: timeline ? timeline.map(event => ({
      time: new Date(event.time),
      event: event.event
    })) : []
  };
};
