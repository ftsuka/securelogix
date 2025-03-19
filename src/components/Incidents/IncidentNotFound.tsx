
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Dashboard/Layout';

export const IncidentNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-10">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Incidente não encontrado</h2>
        <p className="text-muted-foreground mt-2">O incidente solicitado não existe ou foi removido.</p>
        <Button 
          className="mt-6" 
          onClick={() => navigate('/')}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para a lista
        </Button>
      </div>
    </Layout>
  );
};
