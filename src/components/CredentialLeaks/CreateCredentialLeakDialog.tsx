
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { CreateCredentialLeakFormValues } from './types';
import { createCredentialLeak } from '@/services/credentialLeaks';

interface CreateCredentialLeakDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateCredentialLeakDialog: React.FC<CreateCredentialLeakDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const form = useForm<CreateCredentialLeakFormValues>({
    defaultValues: {
      email: '',
      username: '',
      notification_date: new Date(),
      notification_source: '',
      action_taken: '',
      partial_password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createCredentialLeak(data);
      toast.success('Vazamento de credencial registrado com sucesso');
      onOpenChange(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Erro ao registrar vazamento de credencial:', error);
      toast.error('Erro ao registrar vazamento de credencial');
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Registrar Vazamento de Credencial</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar um novo vazamento de credencial.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email vazado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username ou Matrícula</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Username ou matrícula vazada" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partial_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Parcial</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 14********05" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notification_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Notificação</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''} 
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notification_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem da Notificação</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Have I Been Pwned, Dark Web Monitor, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="action_taken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Tomada</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descreva as ações tomadas para mitigar o vazamento"
                      value={field.value || ''}
                    />
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

export default CreateCredentialLeakDialog;
