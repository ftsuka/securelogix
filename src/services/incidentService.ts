
import { supabase } from "@/integrations/supabase/client";
import { Incident } from "@/components/Incidents/types";

// Função auxiliar para transformar dados do Supabase em objetos Incident
const mapDbIncidentToIncident = (incident: any, assignedTo?: any, affectedSystems?: any[], timeline?: any[]): Incident => {
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
    const timelineData = incident.timeline.map(event => ({
      incident_id: newIncident.id,
      event: event.event,
      time: event.time
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

// Atualizar incidente existente
export const updateIncident = async (incident: Incident): Promise<Incident> => {
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
};

// Excluir incidente
export const deleteIncident = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('incidents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir incidente:', error);
    throw error;
  }
};
