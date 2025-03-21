
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { fetchIncidents } from '@/services/incidentService';
import { toast } from 'sonner';
import { Incident } from './types';
import { CreateIncidentDialog } from './CreateIncidentDialog';
import { IncidentFilters } from './IncidentFilters';
import { IncidentStatusTabs } from './IncidentStatusTabs';
import { IncidentContent } from './IncidentContent';
import { useIncidentFilters } from '@/hooks/useIncidentFilters';

export const IncidentList: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    showFilters,
    setShowFilters,
    statusFilter,
    setStatusFilter,
    severityFilter,
    setSeverityFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    selectedTab,
    setSelectedTab,
    resetFilters,
    filteredIncidents
  } = useIncidentFilters(incidents);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await fetchIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Erro ao carregar incidentes:', error);
      toast.error('Não foi possível carregar os incidentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Incidentes de Segurança</h2>
          <p className="text-muted-foreground">Gerencie e monitore todos os incidentes de segurança</p>
        </div>
        
        <div className="flex gap-2">
          <CreateIncidentDialog onIncidentCreated={loadIncidents} />
          
          <IncidentFilters 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            resetFilters={resetFilters}
          />
        </div>
      </div>

      <IncidentStatusTabs
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      >
        <IncidentContent 
          loading={loading}
          filteredIncidents={filteredIncidents}
          resetFilters={resetFilters}
        />
      </IncidentStatusTabs>
    </div>
  );
};

export default IncidentList;
