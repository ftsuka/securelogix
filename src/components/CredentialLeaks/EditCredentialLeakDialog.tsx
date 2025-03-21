
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
import { CredentialLeak, EditCredentialLeakFormValues } from './types';
import { updateCredentialLeak } from '@/services/credentialLeaks';

interface EditCredentialLeakDialogProps {
  leak: CredentialLeak;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditCredentialLeakDialog: React.FC<EditCredentialLeakDialogProps> = ({
  leak,
  open,
  onOpenChange,
  onSuccess
}) => {
  const form = useForm<EditCredentialLeakFormValues>({
    defaultValues: {
      email: leak.email,
      username: leak.username,
      notification_date: leak.notification_date,
      notification_source: leak.notification_source,
      action_taken: leak.action_taken || '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await updateCredentialLeak(leak.id, data);
      toast.success('Vazamento de credencial atualizado com sucesso');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar vazamento de credencial:', error);
      toast.error('Erro ao atualizar vazamento de credencial');
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Editar Vazamento de Credencial</DialogTitle>
          <DialogDescription>
            Atualize os dados do vazamento de credencial.
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
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCredentialLeakDialog;
