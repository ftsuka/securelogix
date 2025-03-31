
import { supabase } from "@/integrations/supabase/client";
import { Incident } from "@/components/Incidents/types";
import { fetchIncidentById } from "./fetchIncidents";

// Atualizar incidente existente
export const updateIncident = async (incident: Incident): Promise<Incident> => {
  try {
    // Atualizar o incidente principal
    const { error } = await supabase
      .from('incidents')
      .update({
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: incident.status,
        type: incident.type,
        additional_details: incident.additionalDetails
      })
      .eq('id', incident.id);

    if (error) {
      console.error('Erro ao atualizar incidente:', error);
      throw error;
    }

    // Atualizar usuário atribuído
    if (incident.assignedTo) {
      // Primeiro, excluir qualquer atribuição existente
      await supabase
        .from('assigned_users')
        .delete()
        .eq('incident_id', incident.id);

      // Depois, inserir a nova atribuição
      const { error: assignedUserError } = await supabase
        .from('assigned_users')
        .insert({
          incident_id: incident.id,
          name: incident.assignedTo.name,
          initials: incident.assignedTo.initials
        });

      if (assignedUserError) {
        console.error('Erro ao atualizar usuário atribuído:', assignedUserError);
      }
    }

    // Atualizar sistemas afetados
    if (incident.affectedSystems) {
      // Primeiro, excluir sistemas existentes
      await supabase
        .from('affected_systems')
        .delete()
        .eq('incident_id', incident.id);

      // Depois, inserir novos sistemas, se houver
      if (incident.affectedSystems.length > 0) {
        const affectedSystemsData = incident.affectedSystems.map(system => ({
          incident_id: incident.id,
          system_name: system
        }));

        const { error: affectedSystemsError } = await supabase
          .from('affected_systems')
          .insert(affectedSystemsData);

        if (affectedSystemsError) {
          console.error('Erro ao atualizar sistemas afetados:', affectedSystemsError);
        }
      }
    }

    // Buscar o incidente atualizado com relacionamentos
    return await fetchIncidentById(incident.id) as Incident;
  } catch (error) {
    console.error('Erro ao atualizar incidente:', error);
    throw error;
  }
};
