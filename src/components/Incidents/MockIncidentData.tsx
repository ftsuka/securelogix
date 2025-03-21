
import { IncidentSeverity, IncidentStatus, IncidentType } from './types';

// Dados simulados para exemplificar (em produção, viriam de uma API)
export const mockIncidents = [
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
