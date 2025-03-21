
import React from 'react';
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
import { Filter, X } from 'lucide-react';
import { IncidentSeverity, IncidentStatus, IncidentType } from './types';

interface IncidentFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: IncidentStatus | 'all';
  setStatusFilter: (status: IncidentStatus | 'all') => void;
  severityFilter: IncidentSeverity | 'all';
  setSeverityFilter: (severity: IncidentSeverity | 'all') => void;
  typeFilter: IncidentType | 'all';
  setTypeFilter: (type: IncidentType | 'all') => void;
  resetFilters: () => void;
}

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  showFilters,
  setShowFilters,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  severityFilter,
  setSeverityFilter,
  typeFilter,
  setTypeFilter,
  resetFilters,
}) => {
  if (!showFilters) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setShowFilters(true)}
        className="gap-2"
      >
        <Filter className="h-4 w-4" />
        Filtros
      </Button>
    );
  }

  return (
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
  );
};
