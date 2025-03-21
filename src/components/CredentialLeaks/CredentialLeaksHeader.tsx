
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface CredentialLeaksHeaderProps {
  onOpenCreateDialog: () => void;
}

const CredentialLeaksHeader: React.FC<CredentialLeaksHeaderProps> = ({ 
  onOpenCreateDialog 
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Vazamentos de Credenciais</h2>
        <p className="text-muted-foreground">Monitoramento e gestão de vazamentos de credenciais</p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onOpenCreateDialog} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo Registro
        </Button>
      </div>
    </div>
  );
};

export default CredentialLeaksHeader;
