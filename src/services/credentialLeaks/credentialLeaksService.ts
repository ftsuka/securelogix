
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
  const { data, error } = await supabase
    .from('credential_leaks')
    .insert([leakData])
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
  const { data, error } = await supabase
    .from('credential_leaks')
    .update(leakData)
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
  const { error } = await supabase
    .from('credential_leaks')
    .delete()
    .eq('id', id);

  if (error) {
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
    created_at: new Date(log.created_at)
  }));
}
