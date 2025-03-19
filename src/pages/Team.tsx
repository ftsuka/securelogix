
import { Layout } from '@/components/Dashboard/Layout';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchIncidents } from '@/services/incidentService';
import { Incident } from '@/components/Incidents/types';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTeamMembers, getUserProfile } from '@/services/authService';
import { TeamMember } from '@/components/Team/types';
import { TeamStats } from '@/components/Team/TeamStats';
import { TeamMembersList } from '@/components/Team/TeamMembersList';

const Team = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [incidentsData, membersData] = await Promise.all([
          fetchIncidents(),
          fetchTeamMembers()
        ]);
        
        setIncidents(incidentsData);
        
        // Transform database data to component format
        const formattedMembers = membersData.map(member => ({
          id: member.id,
          name: member.name,
          initials: member.initials,
          image_url: member.image_url,
          role: member.role,
          email: member.email,
          phone: member.phone,
          status: member.status as 'available' | 'busy' | 'offline',
          assignedIncidents: 0,
          resolvedIncidents: 0
        }));
        
        setTeamMembers(formattedMembers);
        
        // Fetch user profile if authenticated
        if (user) {
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);
  
  // Calculate assigned incidents per team member
  const teamWithStats = teamMembers.map(member => {
    const assigned = incidents.filter(
      incident => incident.assignedTo?.name === member.name
    ).length;
    
    const resolved = incidents.filter(
      incident => 
        incident.assignedTo?.name === member.name && 
        (incident.status === 'resolved' || incident.status === 'closed')
    ).length;
    
    return {
      ...member,
      assignedIncidents: assigned,
      resolvedIncidents: resolved
    };
  });
  
  const totalAssigned = teamWithStats.reduce((sum, member) => sum + member.assignedIncidents, 0);
  const totalResolved = teamWithStats.reduce((sum, member) => sum + member.resolvedIncidents, 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Carregando membros da equipe...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Equipe de Segurança</h2>
            <p className="text-muted-foreground">Membros responsáveis pela resposta a incidentes</p>
          </div>
        </div>

        <TeamStats 
          teamMembers={teamWithStats}
          totalAssigned={totalAssigned}
          totalResolved={totalResolved}
        />

        <TeamMembersList 
          teamMembers={teamWithStats}
          userProfile={userProfile}
          user={user}
        />
      </div>
    </Layout>
  );
};

export default Team;
