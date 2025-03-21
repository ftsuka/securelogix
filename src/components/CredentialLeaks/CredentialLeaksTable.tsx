
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileEdit, Trash2, History } from 'lucide-react';
import { CredentialLeak } from './types';
import { format } from 'date-fns';

interface CredentialLeaksTableProps {
  leaks: CredentialLeak[];
  onEdit: (leak: CredentialLeak) => void;
  onDelete: (id: string) => void;
  onViewLogs: (leak: CredentialLeak) => void;
}

const CredentialLeaksTable: React.FC<CredentialLeaksTableProps> = ({
  leaks,
  onEdit,
  onDelete,
  onViewLogs
}) => {
  return (
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
          {leaks.map(leak => (
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
                    onClick={() => onViewLogs(leak)}
                    title="Ver histórico"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(leak)}
                    title="Editar"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(leak.id)}
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
  );
};

export default CredentialLeaksTable;
