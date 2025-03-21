
import React from 'react';
import { IncidentType } from './types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Bug, Mail, Lock, Database, Zap, HelpCircle, Plus, Check } from 'lucide-react';
import { getTypeIcon, getTypeLabel } from './IncidentDetailUtils';
import { fetchCustomIncidentTypes } from '@/services/incidents';
import { CustomIncidentType } from './types';

interface IncidentTypeMenuProps {
  selectedType: IncidentType;
  onSelectType: (type: IncidentType) => void;
  showAddOption?: boolean;
  onAddType?: () => void;
}

export const IncidentTypeMenu: React.FC<IncidentTypeMenuProps> = ({
  selectedType,
  onSelectType,
  showAddOption = false,
  onAddType
}) => {
  const [customTypes, setCustomTypes] = React.useState<CustomIncidentType[]>([]);
  
  React.useEffect(() => {
    const loadCustomTypes = async () => {
      try {
        const types = await fetchCustomIncidentTypes();
        setCustomTypes(types);
      } catch (error) {
        console.error('Erro ao carregar tipos personalizados:', error);
      }
    };
    loadCustomTypes();
  }, []);

  const standardTypes: IncidentType[] = [
    'malware',
    'phishing',
    'unauthorized-access',
    'data-breach',
    'ddos',
    'other'
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          {getTypeIcon(selectedType)}
          <span className="truncate">{getTypeLabel(selectedType)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Tipos de Incidente</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {standardTypes.map(type => (
            <DropdownMenuItem 
              key={type} 
              onClick={() => onSelectType(type)}
              className="flex items-center gap-2"
            >
              {getTypeIcon(type)}
              <span>{getTypeLabel(type)}</span>
              {selectedType === type && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        {customTypes.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Tipos Personalizados</DropdownMenuLabel>
            <DropdownMenuGroup>
              {customTypes.map(type => (
                <DropdownMenuItem 
                  key={type.id} 
                  onClick={() => onSelectType(type.name)}
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>{type.name}</span>
                  {selectedType === type.name && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
        
        {showAddOption && onAddType && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onAddType}
              className="flex items-center gap-2 text-primary"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar novo tipo</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
