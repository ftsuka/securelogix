
import { supabase } from "@/integrations/supabase/client";
import { Incident } from "@/components/Incidents/types";
import { fetchIncidentById } from "./fetchIncidents";

// Criar novo incidente
export const createIncident = async (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Promise<Incident> => {
  // Inserir o incidente principal
  const { data: newIncident, error } = await supabase
    .from('incidents')
    .insert({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
      type: incident.type,
      additional_details: incident.additionalDetails
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar incidente:', error);
    throw error;
  }

  // Inserir usuário atribuído, se existir
  if (incident.assignedTo) {
    const { error: assignedUserError } = await supabase
      .from('assigned_users')
      .insert({
        incident_id: newIncident.id,
        name: incident.assignedTo.name,
        initials: incident.assignedTo.initials
      });

    if (assignedUserError) {
      console.error('Erro ao atribuir usuário ao incidente:', assignedUserError);
    }
  }

  // Inserir sistemas afetados, se existirem
  if (incident.affectedSystems && incident.affectedSystems.length > 0) {
    const affectedSystemsData = incident.affectedSystems.map(system => ({
      incident_id: newIncident.id,
      system_name: system
    }));

    const { error: affectedSystemsError } = await supabase
      .from('affected_systems')
      .insert(affectedSystemsData);

    if (affectedSystemsError) {
      console.error('Erro ao adicionar sistemas afetados:', affectedSystemsError);
    }
  }

  // Inserir eventos da linha do tempo, se existirem
  if (incident.timeline && incident.timeline.length > 0) {
    // Converter objetos Date para string ISO
    const timelineData = incident.timeline.map(event => ({
      incident_id: newIncident.id,
      event: event.event,
      time: event.time.toISOString()
    }));

    const { error: timelineError } = await supabase
      .from('timeline_events')
      .insert(timelineData);

    if (timelineError) {
      console.error('Erro ao adicionar eventos à linha do tempo:', timelineError);
    }
  }

  // Buscar o incidente completo com relacionamentos
  return await fetchIncidentById(newIncident.id) as Incident;
};
