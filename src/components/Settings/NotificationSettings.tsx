
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notificações atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso."
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Preferências de Notificação</h3>
        <p className="text-sm text-muted-foreground">
          Escolha como e quando deseja receber notificações
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Métodos de notificação</h4>
          <div className="flex flex-col space-y-4">
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="r1" />
                <Label htmlFor="r1">Todos os métodos (Email e Push)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="r2" />
                <Label htmlFor="r2">Apenas Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="push" id="r3" />
                <Label htmlFor="r3">Apenas notificações Push</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tipos de notificação</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="incidents">Novos incidentes</Label>
                <p className="text-xs text-muted-foreground">
                  Notificações quando novos incidentes são reportados
                </p>
              </div>
              <Switch id="incidents" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="updates">Atualizações de incidentes</Label>
                <p className="text-xs text-muted-foreground">
                  Notificações quando incidentes são atualizados
                </p>
              </div>
              <Switch id="updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="comments">Comentários e menções</Label>
                <p className="text-xs text-muted-foreground">
                  Notificações quando você é mencionado em comentários
                </p>
              </div>
              <Switch id="comments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="critical">Incidentes críticos</Label>
                <p className="text-xs text-muted-foreground">
                  Notificações para incidentes marcados como críticos
                </p>
              </div>
              <Switch id="critical" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reports">Relatórios semanais</Label>
                <p className="text-xs text-muted-foreground">
                  Receba um resumo semanal dos incidentes e status
                </p>
              </div>
              <Switch id="reports" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline">Restaurar padrões</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
