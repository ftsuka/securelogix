
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, ArrowUpRight, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IncidentSeverity, IncidentStatus, IncidentType } from './types';
import { getSeverityIcon, getStatusColor, getTypeIcon, getTypeLabel } from './IncidentDetailUtils';

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

export default IncidentCard;
