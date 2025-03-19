
import { supabase } from "@/integrations/supabase/client";

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
