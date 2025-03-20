
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileFormProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export const ProfileForm = ({
  userId,
  firstName,
  lastName,
  email,
  role,
  bio,
  onFirstNameChange,
  onLastNameChange,
  onRoleChange,
  onBioChange
}: ProfileFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role: role,
          bio: bio,
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações de perfil foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => onFirstNameChange(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => onLastNameChange(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            disabled 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Cargo</Label>
          <Input 
            id="role" 
            value={role} 
            onChange={(e) => onRoleChange(e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            rows={4}
            placeholder="Conte sobre você e sua experiência..."
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => window.location.reload()}>Cancelar</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </>
  );
};
