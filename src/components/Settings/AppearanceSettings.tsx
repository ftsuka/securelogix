
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Monitor, Type, LayoutGrid } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AppearanceSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    density,
    setDensity,
    applyTheme
  } = useTheme();
  
  const [fontScale, setFontScale] = useState<number[]>([2]);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [contrastMode, setContrastMode] = useState<'normal' | 'high'>('normal');
  
  // Aplicar alterações em tempo real quando o previewing estiver ativado
  const handlePreviewChange = (value: boolean) => {
    setPreviewEnabled(value);
    if (value) {
      applyTheme();
    }
  };
  
  const fontScaleOptions = [
    { value: 1, label: 'Pequena' },
    { value: 2, label: 'Média' },
    { value: 3, label: 'Grande' }
  ];
  
  const handleFontScaleChange = (value: number[]) => {
    setFontScale(value);
    const scaledSize = value[0] === 1 ? 'small' : value[0] === 3 ? 'large' : 'medium';
    setFontSize(scaledSize as 'small' | 'medium' | 'large');
    if (previewEnabled) applyTheme();
  };
  
  const handleSave = () => {
    setIsLoading(true);
    // Aplicar tema
    applyTheme();
    // Simular API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Aparência atualizada",
        description: "Suas preferências de aparência foram atualizadas com sucesso."
      });
    }, 600);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
    if (previewEnabled) applyTheme();
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value as 'system' | 'sans' | 'mono');
    if (previewEnabled) applyTheme();
  };

  const handleDensityChange = (value: string) => {
    setDensity(value as 'comfortable' | 'compact' | 'expanded');
    if (previewEnabled) applyTheme();
  };

  const handleRestoreDefaults = () => {
    setTheme('system');
    setFontSize('medium');
    setFontScale([2]);
    setFontFamily('system');
    setDensity('comfortable');
    setPreviewEnabled(false);
    setAnimationsEnabled(true);
    setContrastMode('normal');
    toast({
      title: "Configurações padrão restauradas",
      description: "Todas as configurações de aparência foram redefinidas para os valores padrão."
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Preferências de Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência da interface para melhor experiência
        </p>
      </div>
      
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex flex-col space-y-1">
          <h4 className="text-sm font-medium">Visualização em tempo real</h4>
          <span className="text-xs text-muted-foreground">
            Ative para visualizar as mudanças enquanto ajusta as configurações
          </span>
        </div>
        <Switch 
          checked={previewEnabled} 
          onCheckedChange={handlePreviewChange} 
        />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tema</h4>
          <RadioGroup 
            defaultValue={theme} 
            value={theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
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
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Tamanho da fonte</h4>
            <span className="text-sm text-muted-foreground">
              {fontScaleOptions.find(opt => opt.value === fontScale[0])?.label || 'Médio'}
            </span>
          </div>
          <Slider
            defaultValue={[2]}
            value={fontScale}
            onValueChange={handleFontScaleChange}
            min={1}
            max={3}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pequena</span>
            <span>Média</span>
            <span>Grande</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Densidade de informações</h4>
          <RadioGroup 
            value={density} 
            onValueChange={handleDensityChange}
            className="space-y-3"
          >
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
          <RadioGroup 
            value={fontFamily} 
            onValueChange={handleFontFamilyChange}
            className="space-y-3"
          >
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
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Animações e efeitos</h4>
          <div className="flex items-center justify-between pb-2">
            <div className="space-y-0.5">
              <Label className="cursor-pointer">Ativar animações</Label>
              <p className="text-xs text-muted-foreground">
                Desative para melhorar o desempenho em dispositivos mais antigos
              </p>
            </div>
            <Switch 
              checked={animationsEnabled} 
              onCheckedChange={setAnimationsEnabled} 
            />
          </div>
          <div className="flex items-center justify-between pb-2">
            <div className="space-y-0.5">
              <Label className="cursor-pointer">Modo de alto contraste</Label>
              <p className="text-xs text-muted-foreground">
                Aumenta o contraste para melhor acessibilidade
              </p>
            </div>
            <Switch 
              checked={contrastMode === 'high'} 
              onCheckedChange={(checked) => setContrastMode(checked ? 'high' : 'normal')} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleRestoreDefaults}>
          Restaurar padrões
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
