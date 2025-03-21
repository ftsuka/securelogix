
import { useState, useEffect } from 'react';
import { Incident, IncidentSeverity, IncidentStatus, IncidentType } from '@/components/Incidents/types';

export const useIncidentFilters = (incidents: Incident[]) => {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  const resetFilters = () => {
    setStatusFilter('all');
    setSeverityFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };
  
  const filteredIncidents = incidents.filter(incident => {
    if (statusFilter !== 'all' && incident.status !== statusFilter) {
      return false;
    }
    
    if (severityFilter !== 'all' && incident.severity !== severityFilter) {
      return false;
    }
    
    if (typeFilter !== 'all' && incident.type !== typeFilter) {
      return false;
    }
    
    if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !incident.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
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
  
  return {
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
  };
};
