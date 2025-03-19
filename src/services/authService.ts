import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TeamMember } from "@/components/Team/types";

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Sessão encerrada",
      description: "Você saiu com sucesso",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao sair:", error);
    toast({
      title: "Erro ao sair",
      description: "Ocorreu um erro inesperado",
      variant: "destructive",
    });
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return data.user;
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    return null;
  }
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const [teamMembersResponse, profilesResponse] = await Promise.all([
      supabase.from('team_members').select('*'),
      supabase.from('profiles').select('*').not('role', 'is', null)
    ]);
    
    if (teamMembersResponse.error) {
      throw teamMembersResponse.error;
    }
    
    if (profilesResponse.error) {
      throw profilesResponse.error;
    }
    
    const teamMembers = (teamMembersResponse.data || []).map(member => ({
      id: member.id,
      name: member.name,
      initials: member.initials,
      image_url: member.image_url,
      role: member.role,
      email: member.email,
      phone: member.phone,
      status: member.status,
      assignedIncidents: 0,
      resolvedIncidents: 0,
      isProfileUser: false
    }));
    
    const profileMembers = (profilesResponse.data || [])
      .filter(profile => profile.role)
      .map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown User',
        initials: profile.initials || (profile.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'),
        image_url: profile.avatar_url,
        role: profile.role || 'Team Member',
        email: '',
        phone: profile.phone || '',
        status: profile.status || 'available',
        assignedIncidents: 0,
        resolvedIncidents: 0,
        isProfileUser: true
      }));
    
    return [...teamMembers, ...profileMembers];
  } catch (error) {
    console.error("Erro ao buscar membros da equipe:", error);
    return [];
  }
};
