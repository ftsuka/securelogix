
import { useState } from 'react';
import { Layout } from '@/components/Dashboard/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Bell, Shield, Eye } from 'lucide-react';
import ProfileSettings from '@/components/Settings/ProfileSettings';
import NotificationSettings from '@/components/Settings/NotificationSettings';
import SecuritySettings from '@/components/Settings/SecuritySettings';
import AppearanceSettings from '@/components/Settings/AppearanceSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Configurações</h2>
            <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
          </div>
        </div>

        <Card>
          <CardHeader className="px-7 pb-0">
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Configurações
            </CardTitle>
            <CardDescription>
              Personalize a plataforma de acordo com suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="profile"
                  className="rounded-none border-b-2 border-transparent px-7 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="rounded-none border-b-2 border-transparent px-7 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-none border-b-2 border-transparent px-7 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="rounded-none border-b-2 border-transparent px-7 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Aparência
                </TabsTrigger>
              </TabsList>
              <div className="p-7">
                <TabsContent value="profile" className="mt-0">
                  <ProfileSettings />
                </TabsContent>
                <TabsContent value="notifications" className="mt-0">
                  <NotificationSettings />
                </TabsContent>
                <TabsContent value="security" className="mt-0">
                  <SecuritySettings />
                </TabsContent>
                <TabsContent value="appearance" className="mt-0">
                  <AppearanceSettings />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
