
import { supabase } from "@/integrations/supabase/client";
import { Incident } from "@/components/Incidents/types";
import { mockIncidents } from "@/components/Incidents/MockIncidentData";

// Função para inserir dados de exemplo no Supabase
export const insertSampleData = async () => {
  // Verificar se já existem dados
  const { count } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true });

  // Se já existirem dados, não fazer nada
  if (count && count > 0) {
    console.log('Já existem dados no banco de dados.');
    return;
  }

  console.log('Inserindo dados de exemplo...');

  // Inserir os incidentes de exemplo
  for (const mockIncident of mockIncidents) {
    try {
      // Inserir o incidente principal
      const { data: incident, error } = await supabase
        .from('incidents')
        .insert({
          title: mockIncident.title,
          description: mockIncident.description,
          severity: mockIncident.severity,
          status: mockIncident.status,
          type: mockIncident.type,
          additional_details: mockIncident.additionalDetails,
          created_at: mockIncident.createdAt?.toISOString(),
          updated_at: mockIncident.updatedAt?.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir incidente:', error);
        continue;
      }

      // Inserir usuário atribuído, se existir
      if (mockIncident.assignedTo) {
        await supabase
          .from('assigned_users')
          .insert({
            incident_id: incident.id,
            name: mockIncident.assignedTo.name,
            initials: mockIncident.assignedTo.initials
          });
      }

      // Inserir sistemas afetados, se existirem
      if (mockIncident.affectedSystems && mockIncident.affectedSystems.length > 0) {
        const affectedSystemsData = mockIncident.affectedSystems.map(system => ({
          incident_id: incident.id,
          system_name: system
        }));

        await supabase
          .from('affected_systems')
          .insert(affectedSystemsData);
      }

      // Inserir eventos da linha do tempo, se existirem
      if (mockIncident.timeline && mockIncident.timeline.length > 0) {
        const timelineData = mockIncident.timeline.map(event => ({
          incident_id: incident.id,
          event: event.event,
          time: event.time.toISOString()
        }));

        await supabase
          .from('timeline_events')
          .insert(timelineData);
      }

      console.log(`Incidente "${mockIncident.title}" inserido com sucesso!`);
    } catch (error) {
      console.error('Erro ao inserir dados de exemplo:', error);
    }
  }

  console.log('Dados de exemplo inseridos com sucesso!');
};

// Exportar para uso na inicialização
export default insertSampleData;
