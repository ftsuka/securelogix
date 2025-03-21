
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

export const CredentialLeaksList: React.FC = () => {
  const [leaks, setLeaks] = useState<CredentialLeak[]>([]);
  const [filteredLeaks, setFilteredLeaks] = useState<CredentialLeak[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLeak, setSelectedLeak] = useState<CredentialLeak | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);

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
          leak.notification_source.toLowerCase().includes(query)
      );
      setFilteredLeaks(filtered);
    }
  }, [searchQuery, leaks]);

  const handleDeleteLeak = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await deleteCredentialLeak(id);
        toast.success('Vazamento de credencial excluído com sucesso');
        loadCredentialLeaks();
      } catch (error) {
        console.error('Erro ao excluir vazamento de credencial:', error);
        toast.error('Erro ao excluir vazamento de credencial');
      }
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
              onDelete={handleDeleteLeak}
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
    </div>
  );
};

export default CredentialLeaksList;
