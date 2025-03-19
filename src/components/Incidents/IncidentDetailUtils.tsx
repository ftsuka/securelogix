
import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Activity
} from 'lucide-react';
import { 
  IncidentSeverity, 
  IncidentStatus, 
  IncidentType 
} from '@/components/Incidents/IncidentCard';

// Utility functions for incident status and type display
export const getSeverityIcon = (severity: IncidentSeverity) => {
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

export const getStatusColor = (status: IncidentStatus) => {
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

export const getStatusLabel = (status: IncidentStatus) => {
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

export const getTypeIcon = (type: IncidentType) => {
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

export const getTypeLabel = (type: IncidentType) => {
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
