
import { supabase } from "@/integrations/supabase/client";

// Excluir incidente
export const deleteIncident = async (id: string): Promise<void> => {
  try {
    // First, delete related records
    await supabase
      .from('assigned_users')
      .delete()
      .eq('incident_id', id);
      
    await supabase
      .from('affected_systems')
      .delete()
      .eq('incident_id', id);
      
    await supabase
      .from('timeline_events')
      .delete()
      .eq('incident_id', id);

    // Then delete the main incident record
    const { error } = await supabase
      .from('incidents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir incidente:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao excluir incidente:', error);
    throw error;
  }
};
