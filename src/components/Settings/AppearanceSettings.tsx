
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Monitor } from 'lucide-react';

const AppearanceSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Aparência atualizada",
        description: "Suas preferências de aparência foram atualizadas com sucesso."
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Preferências de Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência da interface para melhor experiência
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tema</h4>
          <RadioGroup defaultValue="system" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <RadioGroupItem 
                value="light" 
                id="theme-light" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="theme-light" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <h4 className="text-sm font-medium">Claro</h4>
                  <p className="text-xs text-muted-foreground">
                    Tema claro para ambientes bem iluminados
                  </p>
                </div>
              </Label>
            </div>
            
            <div className="relative">
              <RadioGroupItem 
                value="dark" 
                id="theme-dark" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="theme-dark" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <h4 className="text-sm font-medium">Escuro</h4>
                  <p className="text-xs text-muted-foreground">
                    Tema escuro para reduzir o cansaço visual
                  </p>
                </div>
              </Label>
            </div>
            
            <div className="relative">
              <RadioGroupItem 
                value="system" 
                id="theme-system" 
                className="sr-only peer" 
              />
              <Label 
                htmlFor="theme-system" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Monitor className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <h4 className="text-sm font-medium">Sistema</h4>
                  <p className="text-xs text-muted-foreground">
                    Segue as preferências do seu sistema
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Densidade de informações</h4>
          <RadioGroup defaultValue="comfortable" className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="density-comfortable" />
              <Label htmlFor="density-comfortable">Confortável</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="density-compact" />
              <Label htmlFor="density-compact">Compacto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expanded" id="density-expanded" />
              <Label htmlFor="density-expanded">Expandido</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Preferências de fonte</h4>
          <RadioGroup defaultValue="system" className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="font-system" />
              <Label htmlFor="font-system">Fonte do sistema</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sans" id="font-sans" />
              <Label htmlFor="font-sans">Sans-serif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mono" id="font-mono" />
              <Label htmlFor="font-mono">Monoespaçada</Label>
            </div>
          </RadioGroup>
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

export default AppearanceSettings;
