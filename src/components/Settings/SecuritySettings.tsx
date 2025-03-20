
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'A senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(6, 'A nova senha deve ter pelo menos 6 caracteres')
    .refine(val => /[A-Z]/.test(val), {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .refine(val => /[0-9]/.test(val), {
      message: 'A senha deve conter pelo menos um número',
    }),
  confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const SecuritySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Segurança atualizada",
        description: "Suas configurações de segurança foram atualizadas com sucesso."
      });
    }, 1000);
  };

  const onSubmitPasswordChange = async (values: PasswordFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não está autenticado",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPasswordChangeSuccess(false);
    
    try {
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: values.currentPassword,
      });
      
      if (signInError) {
        throw new Error('Senha atual incorreta');
      }
      
      // Update password if current password is correct
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Clear form
      form.reset();
      setPasswordChangeSuccess(true);
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro ao alterar senha",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao alterar sua senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Configurações de Segurança</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas configurações de segurança e autenticação
        </p>
      </div>
      
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Alterações nas configurações de segurança podem afetar seu acesso ao sistema.
          Certifique-se de manter suas informações de recuperação atualizadas.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Alterar senha</h4>
          
          {passwordChangeSuccess && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Senha alterada</AlertTitle>
              <AlertDescription>
                Sua senha foi alterada com sucesso.
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPasswordChange)} className="grid gap-3">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Senha atual</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {/[A-Z]/.test(field.value) ? 
                          <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                          <XCircle className="h-3 w-3 text-muted" />}
                        <span>Pelo menos uma letra maiúscula</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/[0-9]/.test(field.value) ? 
                          <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                          <XCircle className="h-3 w-3 text-muted" />}
                        <span>Pelo menos um número</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {field.value.length >= 6 ? 
                          <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                          <XCircle className="h-3 w-3 text-muted" />}
                        <span>Mínimo de 6 caracteres</span>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading ? "Alterando senha..." : "Alterar senha"}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Autenticação de dois fatores</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactor">Ativar autenticação de dois fatores</Label>
              <p className="text-xs text-muted-foreground">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
            <Switch id="twoFactor" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Opções de segurança avançadas</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sessionTimeout">Timeout de sessão</Label>
                <p className="text-xs text-muted-foreground">
                  Encerrar sessão automaticamente após inatividade
                </p>
              </div>
              <Switch id="sessionTimeout" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="loginNotifications">Notificações de login</Label>
                <p className="text-xs text-muted-foreground">
                  Receba notificações de novos logins em sua conta
                </p>
              </div>
              <Switch id="loginNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ipRestriction">Restrição de IP</Label>
                <p className="text-xs text-muted-foreground">
                  Limite o acesso a IPs específicos ou redes confiáveis
                </p>
              </div>
              <Switch id="ipRestriction" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
