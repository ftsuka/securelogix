
import React, { useState, useEffect } from 'react';
import { CredentialLeak } from './types';
import { fetchCredentialLeaks, deleteCredentialLeak } from '@/services/credentialLeaks';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateCredentialLeakDialog from './CreateCredentialLeakDialog';
import EditCredentialLeakDialog from './EditCredentialLeakDialog';
import CredentialLeakLogsDialog from './CredentialLeakLogsDialog';
import CredentialLeaksHeader from './CredentialLeaksHeader';
import CredentialLeaksSearch from './CredentialLeaksSearch';
import CredentialLeaksTable from './CredentialLeaksTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const CredentialLeaksList: React.FC = () => {
  const [leaks, setLeaks] = useState<CredentialLeak[]>([]);
  const [filteredLeaks, setFilteredLeaks] = useState<CredentialLeak[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLeak, setSelectedLeak] = useState<CredentialLeak | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leakIdToDelete, setLeakIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCredentialLeaks = async () => {
    try {
      setLoading(true);
      const data = await fetchCredentialLeaks();
      setLeaks(data);
      setFilteredLeaks(data);
    } catch (error) {
      console.error('Erro ao carregar vazamentos de credenciais:', error);
      toast.error('Não foi possível carregar os vazamentos de credenciais.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredentialLeaks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLeaks(leaks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = leaks.filter(
        leak =>
          leak.email.toLowerCase().includes(query) ||
          leak.username.toLowerCase().includes(query) ||
          leak.notification_source.toLowerCase().includes(query) ||
          (leak.partial_password && leak.partial_password.toLowerCase().includes(query))
      );
      setFilteredLeaks(filtered);
    }
  }, [searchQuery, leaks]);

  const handleDeleteClick = (id: string) => {
    setLeakIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leakIdToDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deleteCredentialLeak(leakIdToDelete);
      toast.success('Vazamento de credencial excluído com sucesso');
      loadCredentialLeaks();
      setIsDeleteDialogOpen(false);
      setLeakIdToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir vazamento de credencial:', error);
      toast.error('Erro ao excluir vazamento de credencial');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (leak: CredentialLeak) => {
    setSelectedLeak(leak);
    setIsEditDialogOpen(true);
  };

  const handleViewLogs = (leak: CredentialLeak) => {
    setSelectedLeak(leak);
    setIsLogsDialogOpen(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <CredentialLeaksHeader 
        onOpenCreateDialog={() => setIsCreateDialogOpen(true)}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Registros de Vazamentos</CardTitle>
          <CardDescription>
            Lista de todos os vazamentos de credenciais registrados no sistema
          </CardDescription>
          <div className="mt-4">
            <CredentialLeaksSearch 
              searchQuery={searchQuery} 
              onSearchChange={handleSearchChange} 
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Carregando registros...</p>
            </div>
          ) : filteredLeaks.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Nenhum registro encontrado</p>
            </div>
          ) : (
            <CredentialLeaksTable 
              leaks={filteredLeaks}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onViewLogs={handleViewLogs}
            />
          )}
        </CardContent>
      </Card>

      <CreateCredentialLeakDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadCredentialLeaks}
      />

      {selectedLeak && (
        <>
          <EditCredentialLeakDialog 
            leak={selectedLeak}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={loadCredentialLeaks}
          />

          <CredentialLeakLogsDialog 
            leakId={selectedLeak.id}
            open={isLogsDialogOpen}
            onOpenChange={setIsLogsDialogOpen}
          />
        </>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de vazamento de credencial?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CredentialLeaksList;
