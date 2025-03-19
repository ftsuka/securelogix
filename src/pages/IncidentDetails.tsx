
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Dashboard/Layout';
import { toast } from 'sonner';
import { mockIncidents } from '@/components/Incidents/MockIncidentData';
import { IncidentNotFound } from '@/components/Incidents/IncidentNotFound';
import { IncidentHeader } from '@/components/Incidents/IncidentHeader';
import { IncidentDetailCard } from '@/components/Incidents/IncidentDetailCard';
import EditIncidentDialog from '@/components/Incidents/EditIncidentDialog';

// Componente principal da página
const IncidentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [incidentData, setIncidentData] = useState(mockIncidents.find(inc => inc.id === id));
  
  // Se não encontrar o incidente, mostrar uma mensagem de erro
  if (!incidentData) {
    return <IncidentNotFound />;
  }

  const handleSaveIncident = (updatedIncident: any) => {
    // Em uma aplicação real, isso enviaria dados para uma API
    // Para esse exemplo, atualizamos apenas o estado local
    setIncidentData(updatedIncident);
    
    // Também atualizamos o incidente no array de mockIncidents
    // Isso é necessário apenas para este exemplo com dados simulados
    const index = mockIncidents.findIndex(inc => inc.id === updatedIncident.id);
    if (index !== -1) {
      mockIncidents[index] = updatedIncident;
    }
    
    toast.success("Incidente atualizado com sucesso");
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Cabeçalho com botão de voltar */}
        <IncidentHeader onEditClick={() => setShowEditDialog(true)} />
        
        {/* Informações principais do incidente */}
        <IncidentDetailCard incident={incidentData} />
      </div>
      
      {/* Modal de edição */}
      <EditIncidentDialog
        incident={incidentData}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveIncident}
      />
    </Layout>
  );
};

export default IncidentDetails;
