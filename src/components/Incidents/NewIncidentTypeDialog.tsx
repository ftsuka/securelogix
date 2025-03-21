
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { createCustomIncidentType } from '@/services/incidents';
import { toast } from 'sonner';
import { CustomIncidentType } from './types';

interface NewIncidentTypeDialogProps {
  onTypeAdded: (newType: CustomIncidentType) => void;
}

export const NewIncidentTypeDialog: React.FC<NewIncidentTypeDialogProps> = ({ 
  onTypeAdded 
}) => {
  const [newTypeName, setNewTypeName] = useState('');
  const [isAddTypeDialogOpen, setIsAddTypeDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNewType = async () => {
    if (!newTypeName.trim()) {
      toast.error('O nome do tipo não pode estar vazio');
      return;
    }

    setIsLoading(true);
    try {
      const newType = await createCustomIncidentType(newTypeName.trim());
      onTypeAdded(newType);
      setNewTypeName('');
      setIsAddTypeDialogOpen(false);
      toast.success('Novo tipo de incidente adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar novo tipo:', error);
      toast.error('Erro ao adicionar novo tipo de incidente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAddTypeDialogOpen} onOpenChange={setIsAddTypeDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 px-2">
          <PlusCircle className="h-3 w-3" />
          Novo tipo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo tipo de incidente</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="new-type-name">Nome do tipo</Label>
          <Input 
            id="new-type-name" 
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="Ex: Vazamento de informações"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAddNewType} 
            disabled={isLoading || !newTypeName.trim()}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar tipo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
