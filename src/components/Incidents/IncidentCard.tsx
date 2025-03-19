
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, ArrowUpRight, Shield, AlertTriangle, AlertCircle, CheckCircle, Cpu } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentType = 'malware' | 'phishing' | 'unauthorized-access' | 'data-breach' | 'ddos' | 'other';

export interface IncidentCardProps {
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
  className?: string;
  onClick?: () => void;
}

const getSeverityIcon = (severity: IncidentSeverity) => {
  switch (severity) {
    case 'critical':
      return <Shield className="h-4 w-4 text-destructive" />;
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'medium':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'low':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
};

const getTypeIcon = (type: IncidentType) => {
  switch (type) {
    case 'malware':
      return <Cpu className="h-4 w-4" />;
    case 'phishing':
      return <AlertCircle className="h-4 w-4" />;
    case 'unauthorized-access':
      return <Shield className="h-4 w-4" />;
    case 'data-breach':
      return <AlertTriangle className="h-4 w-4" />;
    case 'ddos':
      return <Activity className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
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

export const IncidentCard: React.FC<IncidentCardProps> = ({
  id,
  title,
  description,
  severity,
  status,
  type,
  createdAt,
  updatedAt,
  assignedTo,
  className,
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/incident/${id}`);
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01] border border-border/60 cursor-pointer",
        severity === 'critical' && "border-l-4 border-l-destructive",
        severity === 'high' && "border-l-4 border-l-orange-500",
        severity === 'medium' && "border-l-4 border-l-yellow-500",
        severity === 'low' && "border-l-4 border-l-green-500",
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getSeverityIcon(severity)}
              <CardTitle className="text-lg font-medium leading-none">{title}</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn("px-2 py-1 rounded-md text-xs", getStatusColor(status))}>
            {status === 'open' && "Aberto"}
            {status === 'investigating' && "Investigando"}
            {status === 'resolved' && "Resolvido"}
            {status === 'closed' && "Fechado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 px-2 font-normal">
              {getTypeIcon(type)}
              <span>{getTypeLabel(type)}</span>
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        {assignedTo ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignedTo.avatar} />
              <AvatarFallback className="text-xs">{assignedTo.initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{assignedTo.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Não atribuído</span>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-xs h-8 px-2"
          onClick={(e) => {
            e.stopPropagation(); // Evitar que o clique no botão propague para o cartão
            navigate(`/incident/${id}`);
          }}
        >
          <span>Detalhes</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Import missing component
import { Activity } from 'lucide-react';

export default IncidentCard;
