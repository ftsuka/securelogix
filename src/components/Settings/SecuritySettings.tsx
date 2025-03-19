
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="current">Senha atual</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">Nova senha</Label>
              <Input id="new" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <Input id="confirm" type="password" />
            </div>
          </div>
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
