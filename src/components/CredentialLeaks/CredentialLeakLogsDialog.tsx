
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchCredentialLeakLogs } from '@/services/credentialLeaks';
import { CredentialLeakLog } from './types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CredentialLeakLogsDialogProps {
  leakId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CredentialLeakLogsDialog: React.FC<CredentialLeakLogsDialogProps> = ({
  leakId,
  open,
  onOpenChange,
}) => {
  const [logs, setLogs] = useState<CredentialLeakLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && leakId) {
      fetchLogs();
    }
  }, [open, leakId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchCredentialLeakLogs(leakId);
      setLogs(data);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast.error('Não foi possível carregar o histórico de alterações');
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'Criação';
      case 'UPDATE':
        return 'Atualização';
      case 'DELETE':
        return 'Exclusão';
      default:
        return action;
    }
  };

  const formatChanges = (details: any) => {
    if (details.changed_fields) {
      return Object.entries(details.changed_fields).map(([key, value]) => {
        const oldValue = details.old[key];
        const newValue = details.new[key];
        return (
          <div key={key} className="mb-1">
            <span className="font-medium">{key}:</span> {String(oldValue)} → {String(newValue)}
          </div>
        );
      });
    }
    
    if (details.old) {
      return <div>Registro excluído</div>;
    }
    
    return <div>Registro criado</div>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Histórico de Alterações</DialogTitle>
          <DialogDescription>
            Histórico de todas as alterações feitas neste registro.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando histórico...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-4">
            <p>Nenhum registro de alteração encontrado.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(log.created_at, 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>{getActionLabel(log.action)}</TableCell>
                    <TableCell>{formatChanges(log.details)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CredentialLeakLogsDialog;
