
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações de perfil foram atualizadas com sucesso."
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Informações do Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações pessoais e profissionais
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm" className="mb-1">
            <Upload className="mr-2 h-4 w-4" /> Carregar imagem
          </Button>
          <p className="text-xs text-muted-foreground">
            SVG, PNG ou JPG (máx. 2MB)
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input id="firstName" defaultValue="João" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input id="lastName" defaultValue="Silva" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Cargo</Label>
          <Input id="role" defaultValue="Analista de Segurança" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            rows={4}
            placeholder="Conte sobre você e sua experiência..."
            defaultValue="Analista de segurança com mais de 5 anos de experiência em gestão de incidentes e resposta a ameaças."
          />
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

export default ProfileSettings;
