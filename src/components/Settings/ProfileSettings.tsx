
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/authService';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileForm } from './ProfileForm';

interface ProfileData {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

const ProfileSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
          // Make sure we're casting to the correct ProfileData type with all required fields
          const completeProfileData: ProfileData = {
            id: profileData.id,
            full_name: profileData.full_name,
            username: profileData.username,
            avatar_url: profileData.avatar_url,
            bio: profileData.bio || null,
            role: profileData.role || null,
            created_at: profileData.created_at,
            updated_at: profileData.updated_at
          };
          
          setProfile(completeProfileData);
          
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
      
      {user && (
        <>
          <ProfileAvatar 
            userId={user.id}
            avatarUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
            onAvatarUrlChange={setAvatarUrl}
          />
          
          <ProfileForm
            userId={user.id}
            firstName={firstName}
            lastName={lastName}
            email={email}
            role={role}
            bio={bio}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onRoleChange={setRole}
            onBioChange={setBio}
          />
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
