
import { supabase } from '@/integrations/supabase/client';
import { CredentialLeak, CredentialLeakLog, CreateCredentialLeakFormValues } from '@/components/CredentialLeaks/types';

export async function fetchCredentialLeaks(): Promise<CredentialLeak[]> {
  const { data, error } = await supabase
    .from('credential_leaks')
    .select('*')
    .order('notification_date', { ascending: false });

  if (error) {
    console.error('Erro ao buscar vazamentos de credenciais:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    notification_date: new Date(item.notification_date),
    created_at: new Date(item.created_at),
    updated_at: new Date(item.updated_at)
  }));
}

export async function fetchCredentialLeakById(id: string): Promise<CredentialLeak> {
  const { data, error } = await supabase
    .from('credential_leaks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar vazamento de credencial com ID ${id}:`, error);
    throw error;
  }

  return {
    ...data,
    notification_date: new Date(data.notification_date),
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at)
  };
}

export async function createCredentialLeak(leakData: CreateCredentialLeakFormValues): Promise<CredentialLeak> {
  // Convert Date object to ISO string for the database
  const formattedData = {
    ...leakData,
    notification_date: leakData.notification_date.toISOString(),
  };

  const { data, error } = await supabase
    .from('credential_leaks')
    .insert([formattedData])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar vazamento de credencial:', error);
    throw error;
  }

  return {
    ...data,
    notification_date: new Date(data.notification_date),
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at)
  };
}

export async function updateCredentialLeak(id: string, leakData: Partial<CreateCredentialLeakFormValues>): Promise<CredentialLeak> {
  // Convert Date object to ISO string for the database if it exists
  const formattedData = {
    ...leakData,
    notification_date: leakData.notification_date ? leakData.notification_date.toISOString() : undefined,
  };

  const { data, error } = await supabase
    .from('credential_leaks')
    .update(formattedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar vazamento de credencial com ID ${id}:`, error);
    throw error;
  }

  return {
    ...data,
    notification_date: new Date(data.notification_date),
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at)
  };
}

export async function deleteCredentialLeak(id: string): Promise<void> {
  try {
    // First, fetch the record details to store in logs
    const { data: leakData, error: fetchError } = await supabase
      .from('credential_leaks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error(`Erro ao buscar vazamento de credencial com ID ${id}:`, fetchError);
      throw fetchError;
    }

    if (!leakData) {
      throw new Error(`Vazamento de credencial com ID ${id} não encontrado`);
    }
    
    // Store the leak data temporarily since we'll need it for logging after deletion
    const leakDetails = { ...leakData };
    
    // Delete the credential leak record first
    const { error: deleteError } = await supabase
      .from('credential_leaks')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(`Erro ao excluir vazamento de credencial com ID ${id}:`, deleteError);
      throw deleteError;
    }
    
    // Now create a log entry directly in the logs table without using the trigger
    // This bypasses the foreign key constraint since the record is already deleted
    const { error: logError } = await supabase
      .from('credential_leak_logs')
      .insert({
        credential_leak_id: id,  // We still use the original ID as reference
        action: 'DELETE',
        details: leakDetails
      });
      
    if (logError) {
      console.error(`Erro ao criar log para exclusão do vazamento ID ${id}:`, logError);
      // We don't throw here since the main operation (deletion) succeeded
      // Just log the error as this is a secondary operation
    }
  } catch (error) {
    console.error(`Erro ao excluir vazamento de credencial com ID ${id}:`, error);
    throw error;
  }
}

export async function fetchCredentialLeakLogs(leakId: string): Promise<CredentialLeakLog[]> {
  const { data, error } = await supabase
    .from('credential_leak_logs')
    .select('*')
    .eq('credential_leak_id', leakId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Erro ao buscar logs do vazamento de credencial com ID ${leakId}:`, error);
    throw error;
  }

  return data.map(log => ({
    ...log,
    action: log.action as "CREATE" | "UPDATE" | "DELETE",
    created_at: new Date(log.created_at)
  }));
}
