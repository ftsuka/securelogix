
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle, ShieldCheck } from 'lucide-react';
import { TeamMember } from './types';

interface TeamStatsProps {
  teamMembers: TeamMember[];
  totalAssigned: number;
  totalResolved: number;
}

export const TeamStats = ({ teamMembers, totalAssigned, totalResolved }: TeamStatsProps) => {
  const availableMembers = teamMembers.filter(member => member.status === 'available').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Membros Disponíveis</CardTitle>
          <Users className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {availableMembers}
          </div>
          <p className="text-xs text-muted-foreground">
            Prontos para atendimento
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Incidentes Atribuídos</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAssigned}
          </div>
          <p className="text-xs text-muted-foreground">
            Em análise pela equipe
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Incidentes Resolvidos</CardTitle>
          <ShieldCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalResolved}
          </div>
          <p className="text-xs text-muted-foreground">
            Solucionados pela equipe
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
