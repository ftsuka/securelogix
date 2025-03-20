
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getUserProfile } from '@/services/authService';

interface ProfileData {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
}

const ProfileSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const profileData = await getUserProfile(user.id);
        
        if (profileData) {
          setProfile(profileData);
          
          // Split full name into first and last name if available
          if (profileData.full_name) {
            const nameParts = profileData.full_name.split(' ');
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
          }
          
          // Set email from auth user
          setEmail(user.email || '');
          
          // Set other profile fields
          setRole(profileData.role || '');
          setBio(profileData.bio || '');
          setAvatarUrl(profileData.avatar_url);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar suas informações de perfil",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) return;
    
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
        .eq('id', user.id);
      
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

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    }
    return 'U';
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    try {
      setIsLoading(true);
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data) {
        // Update the profile with the new avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: data.publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        setAvatarUrl(data.publicUrl);
        
        toast({
          title: "Avatar atualizado",
          description: "Sua foto de perfil foi atualizada com sucesso."
        });
      }
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível fazer o upload da imagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Carregando informações do perfil...</span>
      </div>
    );
  }

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
          <AvatarImage src={avatarUrl || ''} alt="Avatar" />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <label className="cursor-pointer">
            <Input 
              type="file" 
              id="avatar" 
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" className="mb-1" as="span">
              <Upload className="mr-2 h-4 w-4" /> Carregar imagem
            </Button>
          </label>
          <p className="text-xs text-muted-foreground">
            SVG, PNG ou JPG (máx. 2MB)
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
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
            onChange={(e) => setRole(e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            rows={4}
            placeholder="Conte sobre você e sua experiência..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => window.location.reload()}>Cancelar</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
