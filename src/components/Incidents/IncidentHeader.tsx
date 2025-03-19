
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit } from 'lucide-react';

interface IncidentHeaderProps {
  onEditClick: () => void;
}

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({ onEditClick }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para a lista
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">Detalhes do Incidente</h2>
        <p className="text-muted-foreground">Informações completas e histórico do incidente</p>
      </div>
      
      <Button 
        variant="outline"
        className="gap-2"
        onClick={onEditClick}
      >
        <Edit className="h-4 w-4" />
        Editar Incidente
      </Button>
    </div>
  );
};
