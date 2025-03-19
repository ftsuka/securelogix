
import { supabase } from "@/integrations/supabase/client";
import { Incident } from "@/components/Incidents/types";
import { mapDbIncidentToIncident } from "./utils";

// Obter todos os incidentes
export const fetchIncidents = async (): Promise<Incident[]> => {
  const { data: incidents, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar incidentes:', error);
    throw error;
  }

  // Para cada incidente, buscar os dados relacionados
  const incidentsWithRelations = await Promise.all(incidents.map(async (incident) => {
    // Buscar usuário atribuído
    const { data: assignedUser } = await supabase
      .from('assigned_users')
      .select('*')
      .eq('incident_id', incident.id)
      .single();

    // Buscar sistemas afetados
    const { data: affectedSystems } = await supabase
      .from('affected_systems')
      .select('*')
      .eq('incident_id', incident.id);

    // Buscar eventos da linha do tempo
    const { data: timeline } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('incident_id', incident.id)
      .order('time', { ascending: true });

    return mapDbIncidentToIncident(incident, assignedUser, affectedSystems, timeline);
  }));

  return incidentsWithRelations;
};

// Obter incidente por ID
export const fetchIncidentById = async (id: string): Promise<Incident | null> => {
  const { data: incident, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Incidente não encontrado
    }
    console.error('Erro ao buscar incidente:', error);
    throw error;
  }

  // Buscar usuário atribuído
  const { data: assignedUser } = await supabase
    .from('assigned_users')
    .select('*')
    .eq('incident_id', id)
    .single();

  // Buscar sistemas afetados
  const { data: affectedSystems } = await supabase
    .from('affected_systems')
    .select('*')
    .eq('incident_id', id);

  // Buscar eventos da linha do tempo
  const { data: timeline } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('incident_id', id)
    .order('time', { ascending: true });

  return mapDbIncidentToIncident(incident, assignedUser, affectedSystems, timeline);
};
