
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EditIncidentFormFields } from './EditIncidentFormFields';
import { toast } from 'sonner';
import { Incident, EditIncidentFormValues } from './types';

interface EditIncidentDialogProps {
  incident: Incident;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedIncident: Incident) => void;
}

const EditIncidentDialog: React.FC<EditIncidentDialogProps> = ({
  incident,
  open,
  onOpenChange,
  onSave
}) => {
  const form = useForm<EditIncidentFormValues>({
    defaultValues: {
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
      type: incident.type,
      additionalDetails: incident.additionalDetails || '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const updatedIncident = {
      ...incident,
      ...data,
    };
    
    onSave(updatedIncident);
    toast.success('Incidente atualizado com sucesso');
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Incidente</DialogTitle>
          <DialogDescription>
            Atualize as informações do incidente. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <EditIncidentFormFields form={form} />
            
            <DialogFooter>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditIncidentDialog;
