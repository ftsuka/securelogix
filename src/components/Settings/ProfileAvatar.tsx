
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  onAvatarUrlChange: (url: string) => void;
}

export const ProfileAvatar = ({ 
  userId, 
  avatarUrl, 
  firstName, 
  lastName, 
  onAvatarUrlChange 
}: ProfileAvatarProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    }
    return 'U';
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !userId) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}-${Math.random()}.${fileExt}`;

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
          .eq('id', userId);

        if (updateError) throw updateError;

        onAvatarUrlChange(data.publicUrl);
        
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

  return (
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
            disabled={isLoading}
          />
          <Button variant="outline" size="sm" className="mb-1" asChild>
            <span>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Carregar imagem
                </>
              )}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground">
          SVG, PNG ou JPG (máx. 2MB)
        </p>
      </div>
    </div>
  );
};
