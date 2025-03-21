
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IncidentStatusTabsProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export const IncidentStatusTabs: React.FC<IncidentStatusTabsProps> = ({
  selectedTab,
  onTabChange,
  children
}) => {
  return (
    <Tabs 
      defaultValue="all" 
      value={selectedTab}
      className="w-full"
      onValueChange={onTabChange}
    >
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="open">Abertos</TabsTrigger>
        <TabsTrigger value="investigating">Investigando</TabsTrigger>
        <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
        <TabsTrigger value="closed">Fechados</TabsTrigger>
      </TabsList>
      
      <TabsContent value={selectedTab} className="mt-0 space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
};
