
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IncidentSeverity, IncidentStatus, IncidentType } from './types';
import { createIncident } from '@/services/incidentService';
import { toast } from 'sonner';

interface NewIncidentFormValues {
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  additionalDetails?: string;
}

interface CreateIncidentDialogProps {
  onIncidentCreated: () => Promise<void>;
}

export const CreateIncidentDialog: React.FC<CreateIncidentDialogProps> = ({ onIncidentCreated }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const form = useForm<NewIncidentFormValues>({
    defaultValues: {
      title: '',
      description: '',
      severity: 'medium',
      status: 'open',
      type: 'other',
      additionalDetails: '',
    },
  });

  const handleCreateIncident = async (data: NewIncidentFormValues) => {
    try {
      const initialEvent = {
        time: new Date(),
        event: 'Incidente criado'
      };

      await createIncident({
        ...data,
        timeline: [initialEvent],
      });

      toast.success('Incidente criado com sucesso!');
      setIsDialogOpen(false);
      form.reset();
      
      await onIncidentCreated();
    } catch (error) {
      console.error('Erro ao criar incidente:', error);
      toast.error('Erro ao criar o incidente. Tente novamente.');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo Incidente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Incidente</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para registrar um novo incidente de segurança.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateIncident)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Título do incidente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descreva o incidente em detalhes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severidade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Crítica</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Aberto</SelectItem>
                        <SelectItem value="investigating">Investigando</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="malware">Malware</SelectItem>
                        <SelectItem value="phishing">Phishing</SelectItem>
                        <SelectItem value="unauthorized-access">Acesso não autorizado</SelectItem>
                        <SelectItem value="data-breach">Vazamento de dados</SelectItem>
                        <SelectItem value="ddos">DDoS</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhes Adicionais</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Detalhes adicionais (opcional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
