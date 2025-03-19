
import React, { useState } from 'react';
import { IncidentCard, IncidentStatus, IncidentSeverity, IncidentType } from './IncidentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Filter, X, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: {
    name: string;
    avatar?: string;
    initials: string;
  };
}

export const IncidentList: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  // Sample incident data
  const incidents: Incident[] = [
    {
      id: '1',
      title: 'Acesso não autorizado ao servidor de produção',
      description: 'Detectado tentativa de acesso suspeito ao servidor principal de produção. Várias tentativas de login falhadas de um IP desconhecido.',
      severity: 'critical',
      status: 'investigating',
      type: 'unauthorized-access',
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      assignedTo: {
        name: 'João Silva',
        initials: 'JS',
      },
    },
    {
      id: '2',
      title: 'Campanha de phishing detectada',
      description: 'Vários funcionários receberam e-mails fraudulentos solicitando credenciais corporativas. Email com origem suspeita.',
      severity: 'high',
      status: 'open',
      type: 'phishing',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      title: 'Malware detectado em estação de trabalho',
      description: 'O antivírus detectou um trojan na estação de trabalho do departamento financeiro. Acesso à rede foi isolado.',
      severity: 'medium',
      status: 'resolved',
      type: 'malware',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      assignedTo: {
        name: 'Maria Santos',
        initials: 'MS',
      },
    },
    {
      id: '4',
      title: 'Vazamento potencial de dados',
      description: 'Transferência suspeita de grande volume de dados para um domínio desconhecido. Possível exfiltração de dados sensíveis.',
      severity: 'high',
      status: 'investigating',
      type: 'data-breach',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      assignedTo: {
        name: 'Carlos Oliveira',
        initials: 'CO',
      },
    },
    {
      id: '5',
      title: 'Ataque DDoS à API pública',
      description: 'Serviço de API apresentando lentidão devido a elevado número de requisições maliciosas. Mitigação em andamento.',
      severity: 'critical',
      status: 'open',
      type: 'ddos',
      createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ];

  // Filter incidents based on selected filters
  const filteredIncidents = incidents.filter(incident => {
    // Status filter
    if (statusFilter !== 'all' && incident.status !== statusFilter) {
      return false;
    }
    
    // Severity filter
    if (severityFilter !== 'all' && incident.severity !== severityFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all' && incident.type !== typeFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !incident.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Tab filter
    if (selectedTab === 'open' && incident.status !== 'open') {
      return false;
    }
    if (selectedTab === 'investigating' && incident.status !== 'investigating') {
      return false;
    }
    if (selectedTab === 'resolved' && incident.status !== 'resolved') {
      return false;
    }
    if (selectedTab === 'closed' && incident.status !== 'closed') {
      return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    setStatusFilter('all');
    setSeverityFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Incidentes de Segurança</h2>
          <p className="text-muted-foreground">Gerencie e monitore todos os incidentes de segurança</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Incidente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Incidente</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para registrar um novo incidente de segurança.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" placeholder="Título do incidente" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" placeholder="Descreva o incidente em detalhes" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="severity">Severidade</Label>
                    <Select>
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Crítica</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="malware">Malware</SelectItem>
                        <SelectItem value="phishing">Phishing</SelectItem>
                        <SelectItem value="unauthorized-access">Acesso não autorizado</SelectItem>
                        <SelectItem value="data-breach">Vazamento de dados</SelectItem>
                        <SelectItem value="ddos">DDoS</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        className="w-full"
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="open">Abertos</TabsTrigger>
          <TabsTrigger value="investigating">Investigando</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          <TabsTrigger value="closed">Fechados</TabsTrigger>
        </TabsList>
        
        {showFilters && (
          <div className="bg-muted/40 p-4 rounded-lg mb-6 animate-slide-down">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filtros avançados</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Pesquisar</Label>
                <Input 
                  id="search" 
                  placeholder="Buscar incidentes..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as IncidentStatus | 'all')}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="investigating">Investigando</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="severity-filter">Severidade</Label>
                <Select 
                  value={severityFilter} 
                  onValueChange={(value) => setSeverityFilter(value as IncidentSeverity | 'all')}
                >
                  <SelectTrigger id="severity-filter">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type-filter">Tipo</Label>
                <Select 
                  value={typeFilter} 
                  onValueChange={(value) => setTypeFilter(value as IncidentType | 'all')}
                >
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="malware">Malware</SelectItem>
                    <SelectItem value="phishing">Phishing</SelectItem>
                    <SelectItem value="unauthorized-access">Acesso não autorizado</SelectItem>
                    <SelectItem value="data-breach">Vazamento de dados</SelectItem>
                    <SelectItem value="ddos">DDoS</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        )}
        
        <TabsContent value={selectedTab} className="mt-0 space-y-4">
          {filteredIncidents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  id={incident.id}
                  title={incident.title}
                  description={incident.description}
                  severity={incident.severity}
                  status={incident.status}
                  type={incident.type}
                  createdAt={incident.createdAt}
                  updatedAt={incident.updatedAt}
                  assignedTo={incident.assignedTo}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">Nenhum incidente encontrado</h3>
              <p className="text-muted-foreground max-w-md mt-1">
                Não há incidentes que correspondam aos filtros selecionados. Tente ajustar seus filtros ou criar um novo incidente.
              </p>
              <Button className="mt-4 gap-2" variant="outline" onClick={resetFilters}>
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentList;
