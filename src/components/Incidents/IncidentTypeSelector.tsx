
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { fetchCustomIncidentTypes, deleteCustomIncidentType } from '@/services/incidents';
import { toast } from 'sonner';
import { EditIncidentFormValues, CustomIncidentType } from './types';
import { NewIncidentTypeDialog } from './NewIncidentTypeDialog';

interface IncidentTypeSelectorProps {
  form: UseFormReturn<EditIncidentFormValues>;
}

export const IncidentTypeSelector: React.FC<IncidentTypeSelectorProps> = ({ form }) => {
  const [customTypes, setCustomTypes] = useState<CustomIncidentType[]>([]);

  // Load custom types when component mounts
  useEffect(() => {
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

  const handleTypeAdded = (newType: CustomIncidentType) => {
    setCustomTypes(prev => [...prev, newType]);
    
    // Automatically select the newly created type
    form.setValue('type', newType.name);
  };

  const handleDeleteType = async (id: string) => {
    try {
      await deleteCustomIncidentType(id);
      setCustomTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Tipo de incidente excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir tipo:', error);
      toast.error('Erro ao excluir tipo de incidente');
    }
  };

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Tipo</FormLabel>
            <NewIncidentTypeDialog onTypeAdded={handleTypeAdded} />
          </div>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* Tipos padrão */}
              <SelectItem value="malware">Malware</SelectItem>
              <SelectItem value="phishing">Phishing</SelectItem>
              <SelectItem value="unauthorized-access">Acesso não autorizado</SelectItem>
              <SelectItem value="data-breach">Vazamento de dados</SelectItem>
              <SelectItem value="ddos">DDoS</SelectItem>
              
              {/* Tipos personalizados */}
              {customTypes.map(type => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
              
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
