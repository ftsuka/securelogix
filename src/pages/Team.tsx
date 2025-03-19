
import { Layout } from '@/components/Dashboard/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  User, 
  ShieldCheck, 
  BarChart, 
  Mail, 
  Phone, 
  Shield, 
  AlertCircle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { fetchIncidents } from '@/services/incidentService';
import { Incident } from '@/components/Incidents/types';

interface TeamMember {
  id: number;
  name: string;
  initials: string;
  image?: string;
  role: string;
  email: string;
  phone: string;
  assignedIncidents: number;
  resolvedIncidents: number;
  status: 'available' | 'busy' | 'offline';
}

const Team = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Ana Silva',
      initials: 'AS',
      role: 'Analista de Segurança',
      email: 'ana.silva@exemplo.com',
      phone: '(11) 98765-4321',
      assignedIncidents: 0,
      resolvedIncidents: 0,
      status: 'available'
    },
    {
      id: 2,
      name: 'Carlos Souza',
      initials: 'CS',
      role: 'Gerente de SOC',
      email: 'carlos.souza@exemplo.com',
      phone: '(11) 91234-5678',
      assignedIncidents: 0,
      resolvedIncidents: 0,
      status: 'busy'
    },
    {
      id: 3,
      name: 'Juliana Almeida',
      initials: 'JA',
      role: 'Especialista Forense',
      email: 'juliana.almeida@exemplo.com',
      phone: '(11) 99876-5432',
      assignedIncidents: 0,
      resolvedIncidents: 0,
      status: 'available'
    },
    {
      id: 4,
      name: 'Marcelo Oliveira',
      initials: 'MO',
      role: 'Analista de Resposta',
      email: 'marcelo.oliveira@exemplo.com',
      phone: '(11) 98877-6655',
      assignedIncidents: 0,
      resolvedIncidents: 0,
      status: 'offline'
    },
    {
      id: 5,
      name: 'Patrícia Santos',
      initials: 'PS',
      role: 'Analista de Segurança Jr.',
      email: 'patricia.santos@exemplo.com',
      phone: '(11) 93322-1100',
      assignedIncidents: 0,
      resolvedIncidents: 0,
      status: 'available'
    }
  ];
  
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (error) {
        console.error('Erro ao carregar incidentes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);
  
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
  
  // Filter team members by search query
  const filteredTeam = teamWithStats.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalAssigned = teamWithStats.reduce((sum, member) => sum + member.assignedIncidents, 0);
  const totalResolved = teamWithStats.reduce((sum, member) => sum + member.resolvedIncidents, 0);
  const availableMembers = teamWithStats.filter(member => member.status === 'available').length;

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
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Equipe de Segurança</h2>
            <p className="text-muted-foreground">Membros responsáveis pela resposta a incidentes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros Disponíveis</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : availableMembers}
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
                {loading ? '...' : totalAssigned}
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
                {loading ? '...' : totalResolved}
              </div>
              <p className="text-xs text-muted-foreground">
                Solucionados pela equipe
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center mb-6">
          <Input
            placeholder="Buscar membro da equipe..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      {member.image ? (
                        <AvatarImage src={member.image} alt={member.name} />
                      ) : null}
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Team;
