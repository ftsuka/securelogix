
import { supabase } from "@/integrations/supabase/client";
import { CustomIncidentType } from "@/components/Incidents/types";

// Buscar todos os tipos de incidentes personalizados
export const fetchCustomIncidentTypes = async (): Promise<CustomIncidentType[]> => {
  const { data, error } = await supabase
    .from('custom_incident_types')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar tipos de incidentes personalizados:', error);
    throw error;
  }

  return data.map(type => ({
    id: type.id,
    name: type.name,
    createdAt: new Date(type.created_at)
  }));
};

// Criar um novo tipo de incidente personalizado
export const createCustomIncidentType = async (name: string): Promise<CustomIncidentType> => {
  // Verificar se o tipo já existe
  const { data: existingType } = await supabase
    .from('custom_incident_types')
    .select('name')
    .eq('name', name)
    .single();

  if (existingType) {
    throw new Error('Este tipo de incidente já existe');
  }

  const { data, error } = await supabase
    .from('custom_incident_types')
    .insert({ name })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar tipo de incidente personalizado:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at)
  };
};

// Excluir um tipo de incidente personalizado
export const deleteCustomIncidentType = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('custom_incident_types')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir tipo de incidente personalizado:', error);
    throw error;
  }
};
