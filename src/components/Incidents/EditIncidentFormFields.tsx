
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EditIncidentFormValues, IncidentSeverity, IncidentStatus, IncidentType, CustomIncidentType } from './types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  fetchCustomIncidentTypes, 
  createCustomIncidentType, 
  deleteCustomIncidentType 
} from '@/services/incidents';
import { toast } from 'sonner';

interface EditIncidentFormFieldsProps {
  form: UseFormReturn<EditIncidentFormValues>;
}

export const EditIncidentFormFields: React.FC<EditIncidentFormFieldsProps> = ({ form }) => {
  const [customTypes, setCustomTypes] = useState<CustomIncidentType[]>([]);
  const [newTypeName, setNewTypeName] = useState('');
  const [isAddTypeDialogOpen, setIsAddTypeDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar tipos personalizados ao montar o componente
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

  const handleAddNewType = async () => {
    if (!newTypeName.trim()) {
      toast.error('O nome do tipo não pode estar vazio');
      return;
    }

    setIsLoading(true);
    try {
      const newType = await createCustomIncidentType(newTypeName.trim());
      setCustomTypes(prev => [...prev, newType]);
      setNewTypeName('');
      setIsAddTypeDialogOpen(false);
      toast.success('Novo tipo de incidente adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar novo tipo:', error);
      toast.error('Erro ao adicionar novo tipo de incidente');
    } finally {
      setIsLoading(false);
    }
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
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severidade</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a severidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="investigating">Investigando</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Tipo</FormLabel>
                <Dialog open={isAddTypeDialogOpen} onOpenChange={setIsAddTypeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 px-2">
                      <PlusCircle className="h-3 w-3" />
                      Novo tipo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar novo tipo de incidente</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="new-type-name">Nome do tipo</Label>
                      <Input 
                        id="new-type-name" 
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                        placeholder="Ex: Vazamento de informações"
                        className="mt-2"
                      />
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleAddNewType} 
                        disabled={isLoading || !newTypeName.trim()}
                      >
                        {isLoading ? 'Adicionando...' : 'Adicionar tipo'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Select 
                onValueChange={field.onChange} 
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
                    <SelectItem key={type.id} value={type.name} className="flex justify-between items-center">
                      <span>{type.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteType(type.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </SelectItem>
                  ))}
                  
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="additionalDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Detalhes Adicionais</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
