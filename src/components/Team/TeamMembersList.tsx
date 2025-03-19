
import { TeamMember } from './types';
import { TeamMemberCard } from './TeamMemberCard';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface TeamMembersListProps {
  teamMembers: TeamMember[];
  userProfile: any;
  user: any;
}

export const TeamMembersList = ({ teamMembers, userProfile, user }: TeamMembersListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter team members by search query
  const filteredTeam = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <div className="flex items-center mb-6">
        <Input
          placeholder="Buscar membro da equipe..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current user card */}
        {userProfile && (
          <TeamMemberCard 
            key="current-user" 
            member={{
              id: user?.id || 'current-user',
              name: userProfile.full_name || user?.email || '',
              initials: userProfile.full_name 
                ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() 
                : 'U',
              image_url: userProfile.avatar_url,
              role: 'Membro da Equipe',
              email: user?.email || '',
              phone: '',
              status: 'available',
              assignedIncidents: 0,
              resolvedIncidents: 0
            }}
            isCurrentUser={true}
          />
        )}

        {/* Team members list */}
        {filteredTeam.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </>
  );
};
