
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMemberCardProps {
  member: TeamMember;
  isCurrentUser?: boolean;
}

export const TeamMemberCard = ({ member, isCurrentUser = false }: TeamMemberCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'busy': return 'Ocupado';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  return (
    <Card className={`overflow-hidden ${isCurrentUser ? 'border-2 border-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {member.image_url ? (
                <AvatarImage src={member.image_url} alt={member.name} />
              ) : null}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{member.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isCurrentUser ? 'Você (Membro da Equipe)' : member.role}
              </p>
            </div>
          </div>
          <Badge className={`${isCurrentUser ? 'bg-primary text-white' : getStatusColor(member.status)}`}>
            {isCurrentUser ? 'Ativo' : getStatusText(member.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          {member.email && (
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{member.email}</span>
            </div>
          )}
          {member.phone && !isCurrentUser && (
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
          )}
          {!isCurrentUser && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <AlertCircle className="mr-1 h-3 w-3" /> Atribuídos
                </span>
                <span className="font-medium">{member.assignedIncidents}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground flex items-center">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Resolvidos
                </span>
                <span className="font-medium">{member.resolvedIncidents}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
