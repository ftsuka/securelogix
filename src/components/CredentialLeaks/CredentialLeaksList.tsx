
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FileEdit, Trash2, History } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CredentialLeak } from './types';
import { fetchCredentialLeaks, deleteCredentialLeak } from '@/services/credentialLeaks';
import { toast } from 'sonner';
import { format } from 'date-fns';
import CreateCredentialLeakDialog from './CreateCredentialLeakDialog';
import EditCredentialLeakDialog from './EditCredentialLeakDialog';
import CredentialLeakLogsDialog from './CredentialLeakLogsDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Vazamentos de Credenciais</h2>
          <p className="text-muted-foreground">Monitoramento e gestão de vazamentos de credenciais</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Registro
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Registros de Vazamentos</CardTitle>
          <CardDescription>
            Lista de todos os vazamentos de credenciais registrados no sistema
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              placeholder="Buscar por email, username..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Username/Matrícula</TableHead>
                    <TableHead>Data da Notificação</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Ação Tomada</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaks.map(leak => (
                    <TableRow key={leak.id}>
                      <TableCell>{leak.email}</TableCell>
                      <TableCell>{leak.username}</TableCell>
                      <TableCell>
                        {format(leak.notification_date, 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{leak.notification_source}</TableCell>
                      <TableCell>
                        {leak.action_taken ? leak.action_taken : 'Nenhuma ação registrada'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewLogs(leak)}
                            title="Ver histórico"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(leak)}
                            title="Editar"
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteLeak(leak.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
