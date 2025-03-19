
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Dashboard/Layout';
import { toast } from 'sonner';
import { IncidentNotFound } from '@/components/Incidents/IncidentNotFound';
import { IncidentHeader } from '@/components/Incidents/IncidentHeader';
import { IncidentDetailCard } from '@/components/Incidents/IncidentDetailCard';
import EditIncidentDialog from '@/components/Incidents/EditIncidentDialog';
import { fetchIncidentById, updateIncident, deleteIncident } from '@/services/incidentService';
import { Incident } from '@/components/Incidents/types';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Componente principal da página
const IncidentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [incidentData, setIncidentData] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    const loadIncident = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchIncidentById(id);
        setIncidentData(data);
      } catch (error) {
        console.error('Erro ao carregar incidente:', error);
        toast.error('Não foi possível carregar os detalhes do incidente.');
      } finally {
        setLoading(false);
      }
    };

    loadIncident();
  }, [id]);

  const handleSaveIncident = async (updatedIncident: Incident) => {
    try {
      const result = await updateIncident(updatedIncident);
      setIncidentData(result);
      toast.success("Incidente atualizado com sucesso");
    } catch (error) {
      console.error('Erro ao atualizar incidente:', error);
      toast.error('Não foi possível atualizar o incidente.');
    }
  };

  const handleDeleteIncident = async () => {
    if (!id) return;
    
    try {
      await deleteIncident(id);
      toast.success("Incidente excluído com sucesso");
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir incidente:', error);
      toast.error('Não foi possível excluir o incidente.');
    }
  };
  
  // Se estiver carregando, mostrar indicador de carregamento
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Carregando detalhes do incidente...</p>
        </div>
      </Layout>
    );
  }
  
  // Se não encontrar o incidente, mostrar uma mensagem de erro
  if (!incidentData) {
    return <IncidentNotFound />;
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Cabeçalho com botões de ação */}
        <div className="flex justify-between items-center">
          <IncidentHeader onEditClick={() => setShowEditDialog(true)} />
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Excluir Incidente
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente este incidente
                  e todos os dados associados a ele.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteIncident} className="bg-destructive text-destructive-foreground">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
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
