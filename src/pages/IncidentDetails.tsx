import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Dashboard/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Activity,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Importar os mesmos tipos do IncidentCard para manter consistência
import { 
  IncidentSeverity, 
  IncidentStatus, 
  IncidentType 
} from '@/components/Incidents/IncidentCard';

// Dados simulados para exemplificar (em produção, viriam de uma API)
const mockIncidents = [
  {
    id: '1',
    title: 'Acesso não autorizado ao servidor de produção',
    description: 'Detectado tentativa de acesso suspeito ao servidor principal de produção. Várias tentativas de login falhadas de um IP desconhecido.',
    severity: 'critical' as IncidentSeverity,
    status: 'investigating' as IncidentStatus,
    type: 'unauthorized-access' as IncidentType,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    assignedTo: {
      name: 'João Silva',
      initials: 'JS',
    },
    additionalDetails: 'Endereço IP de origem: 192.168.1.254. Tentativas repetidas de acesso SSH com credenciais inválidas. Sistema de detecção de intrusão bloqueou o IP após 5 tentativas.',
    affectedSystems: ['Servidor de Produção DB-01', 'Gateway API-PROD'],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 35), event: 'Primeira tentativa de acesso detectada' },
      { time: new Date(Date.now() - 1000 * 60 * 30), event: 'Alerta criado pelo sistema automaticamente' },
      { time: new Date(Date.now() - 1000 * 60 * 25), event: 'Incidente atribuído à João Silva' },
      { time: new Date(Date.now() - 1000 * 60 * 15), event: 'Investigação iniciada' },
    ]
  },
  {
    id: '2',
    title: 'Campanha de phishing detectada',
    description: 'Vários funcionários receberam e-mails fraudulentos solicitando credenciais corporativas. Email com origem suspeita.',
    severity: 'high' as IncidentSeverity,
    status: 'open' as IncidentStatus,
    type: 'phishing' as IncidentType,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    additionalDetails: 'E-mail com domínio similar ao corporativo (corp-security.net em vez de corp-security.com). Contém anexos maliciosos e links para sites de phishing.',
    affectedSystems: ['Email Corporativo', 'Potencial exposição de credenciais'],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 60 * 3), event: 'Primeiro relato do e-mail suspeito' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 2.5), event: 'Equipe de segurança alerta todos os usuários' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 2), event: 'Bloqueio do domínio no filtro de spam' },
    ]
  },
  {
    id: '3',
    title: 'Malware detectado em estação de trabalho',
    description: 'O antivírus detectou um trojan na estação de trabalho do departamento financeiro. Acesso à rede foi isolado.',
    severity: 'medium' as IncidentSeverity,
    status: 'resolved' as IncidentStatus,
    type: 'malware' as IncidentType,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    assignedTo: {
      name: 'Maria Santos',
      initials: 'MS',
    },
    additionalDetails: 'Malware identificado como Trojan.GenericKD.45721123. Origem provável: download de arquivo de fonte não confiável. Estação isolada da rede corporativa.',
    affectedSystems: ['Estação de trabalho FIN-PC-15', 'Sistema Financeiro'],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), event: 'Detecção pelo antivírus' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5), event: 'Isolamento da máquina da rede' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.2), event: 'Início da análise forense' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), event: 'Remoção do malware e verificação completa do sistema' },
    ]
  },
  {
    id: '4',
    title: 'Vazamento potencial de dados',
    description: 'Transferência suspeita de grande volume de dados para um domínio desconhecido. Possível exfiltração de dados sensíveis.',
    severity: 'high' as IncidentSeverity,
    status: 'investigating' as IncidentStatus,
    type: 'data-breach' as IncidentType,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    assignedTo: {
      name: 'Carlos Oliveira',
      initials: 'CO',
    },
    additionalDetails: 'Transferência de aproximadamente 2.3GB de dados para endereço externo. Tráfego detectado pelo sistema de monitoramento da rede. Análise dos logs em andamento.',
    affectedSystems: ['Servidor de arquivos', 'Banco de dados de clientes'],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 60 * 12), event: 'Alerta de transferência anômala de dados' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 10), event: 'Investigação iniciada' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 8), event: 'Bloqueio preventivo do tráfego para o destino' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 6), event: 'Análise de logs e identificação de contas comprometidas' },
    ]
  },
  {
    id: '5',
    title: 'Ataque DDoS à API pública',
    description: 'Serviço de API apresentando lentidão devido a elevado número de requisições maliciosas. Mitigação em andamento.',
    severity: 'critical' as IncidentSeverity,
    status: 'open' as IncidentStatus,
    type: 'ddos' as IncidentType,
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    additionalDetails: 'Ataque distribuído com volume estimado de 120Gbps. Afetando a disponibilidade da API pública. WAF e serviços anti-DDoS ativados. Monitoramento contínuo em andamento.',
    affectedSystems: ['API Gateway', 'Servidores de borda', 'Serviços públicos'],
    timeline: [
      { time: new Date(Date.now() - 1000 * 60 * 15), event: 'Detecção de aumento anormal de tráfego' },
      { time: new Date(Date.now() - 1000 * 60 * 12), event: 'Ativação de proteções anti-DDoS' },
      { time: new Date(Date.now() - 1000 * 60 * 8), event: 'Ajuste de regras de firewall' },
      { time: new Date(Date.now() - 1000 * 60 * 5), event: 'Redução parcial do impacto, monitoramento contínuo' },
    ]
  },
];

// Componentes auxiliares para seções específicas da página
const getSeverityIcon = (severity: IncidentSeverity) => {
  switch (severity) {
    case 'critical':
      return <Shield className="h-5 w-5 text-destructive" />;
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'medium':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'low':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Shield className="h-5 w-5" />;
  }
};

const getStatusColor = (status: IncidentStatus) => {
  switch (status) {
    case 'open':
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case 'investigating':
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case 'resolved':
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case 'closed':
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getStatusLabel = (status: IncidentStatus) => {
  switch (status) {
    case 'open':
      return "Aberto";
    case 'investigating':
      return "Investigando";
    case 'resolved':
      return "Resolvido";
    case 'closed':
      return "Fechado";
    default:
      return status;
  }
};

const getTypeIcon = (type: IncidentType) => {
  switch (type) {
    case 'malware':
      return <Activity className="h-5 w-5" />;
    case 'phishing':
      return <AlertCircle className="h-5 w-5" />;
    case 'unauthorized-access':
      return <Shield className="h-5 w-5" />;
    case 'data-breach':
      return <AlertTriangle className="h-5 w-5" />;
    case 'ddos':
      return <Activity className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

const getTypeLabel = (type: IncidentType) => {
  switch (type) {
    case 'malware':
      return "Malware";
    case 'phishing':
      return "Phishing";
    case 'unauthorized-access':
      return "Acesso não autorizado";
    case 'data-breach':
      return "Vazamento de dados";
    case 'ddos':
      return "DDoS";
    default:
      return "Outro";
  }
};

// Componente principal da página
const IncidentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Buscar o incidente pelo ID
  const incident = mockIncidents.find(inc => inc.id === id);
  
  // Se não encontrar o incidente, mostrar uma mensagem de erro
  if (!incident) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">Incidente não encontrado</h2>
          <p className="text-muted-foreground mt-2">O incidente solicitado não existe ou foi removido.</p>
          <Button 
            className="mt-6" 
            onClick={() => navigate('/')}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Cabeçalho com botão de voltar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para a lista
            </Button>
            <h2 className="text-2xl font-semibold tracking-tight">Detalhes do Incidente</h2>
            <p className="text-muted-foreground">Informações completas e histórico do incidente</p>
          </div>
        </div>
        
        {/* Informações principais do incidente */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                {getSeverityIcon(incident.severity)}
                <CardTitle>{incident.title}</CardTitle>
              </div>
              <Badge variant="outline" className={`px-3 py-1.5 text-sm ${getStatusColor(incident.status)}`}>
                {getStatusLabel(incident.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Descrição */}
            <div>
              <h3 className="text-lg font-medium mb-2">Descrição</h3>
              <p className="text-muted-foreground">{incident.description}</p>
              {incident.additionalDetails && (
                <p className="text-muted-foreground mt-2">{incident.additionalDetails}</p>
              )}
            </div>
            
            {/* Metadados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Criado em</p>
                  <p className="font-medium">{format(incident.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última atualização</p>
                  <p className="font-medium">{format(incident.updatedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(incident.type)}
                    <span className="font-medium">{getTypeLabel(incident.type)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Responsável */}
            <div>
              <h3 className="text-lg font-medium mb-3">Responsável</h3>
              {incident.assignedTo ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{incident.assignedTo.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{incident.assignedTo.name}</p>
                    <p className="text-sm text-muted-foreground">Analista de Segurança</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <p className="text-muted-foreground">Não atribuído</p>
                </div>
              )}
            </div>
            
            {/* Sistemas afetados */}
            {incident.affectedSystems && (
              <div>
                <h3 className="text-lg font-medium mb-3">Sistemas Afetados</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {incident.affectedSystems.map((system, index) => (
                    <li key={index}>{system}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Linha do tempo */}
            {incident.timeline && (
              <div>
                <h3 className="text-lg font-medium mb-3">Linha do Tempo</h3>
                <div className="space-y-4">
                  {incident.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mt-1 relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </div>
                      <div>
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(event.time, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default IncidentDetails;
