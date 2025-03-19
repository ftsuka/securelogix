
import React, { useState, useEffect } from 'react';
import { IncidentCard } from './IncidentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Filter, X, AlertCircle, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Incident, IncidentSeverity, IncidentStatus, IncidentType } from './types';
import { fetchIncidents, createIncident } from '@/services/incidentService';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface NewIncidentFormValues {
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  additionalDetails?: string;
}

export const IncidentList: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<NewIncidentFormValues>({
    defaultValues: {
      title: '',
      description: '',
      severity: 'medium',
      status: 'open',
      type: 'other',
      additionalDetails: '',
    },
  });

  // Carregar incidentes do Supabase
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (error) {
        console.error('Erro ao carregar incidentes:', error);
        toast.error('Não foi possível carregar os incidentes.');
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  // Filtrar incidentes baseado nos filtros selecionados
  const filteredIncidents = incidents.filter(incident => {
    // Status filter
    if (statusFilter !== 'all' && incident.status !== statusFilter) {
      return false;
    }
    
    // Severity filter
    if (severityFilter !== 'all' && incident.severity !== severityFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all' && incident.type !== typeFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !incident.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Tab filter
    if (selectedTab === 'open' && incident.status !== 'open') {
      return false;
    }
    if (selectedTab === 'investigating' && incident.status !== 'investigating') {
      return false;
    }
    if (selectedTab === 'resolved' && incident.status !== 'resolved') {
      return false;
    }
    if (selectedTab === 'closed' && incident.status !== 'closed') {
      return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    setStatusFilter('all');
    setSeverityFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };

  const handleCreateIncident = async (data: NewIncidentFormValues) => {
    try {
      // Criar o evento inicial
      const initialEvent = {
        time: new Date(),
        event: 'Incidente criado'
      };

      await createIncident({
        ...data,
        timeline: [initialEvent],
      });

      toast.success('Incidente criado com sucesso!');
      setIsDialogOpen(false);
      form.reset();
      
      // Recarregar a lista de incidentes
      const updatedIncidents = await fetchIncidents();
      setIncidents(updatedIncidents);
    } catch (error) {
      console.error('Erro ao criar incidente:', error);
      toast.error('Erro ao criar o incidente. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Incidentes de Segurança</h2>
          <p className="text-muted-foreground">Gerencie e monitore todos os incidentes de segurança</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Incidente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Incidente</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para registrar um novo incidente de segurança.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateIncident)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Título do incidente" />
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
                          <Textarea {...field} placeholder="Descreva o incidente em detalhes" />
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
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="critical">Crítica</SelectItem>
                              <SelectItem value="high">Alta</SelectItem>
                              <SelectItem value="medium">Média</SelectItem>
                              <SelectItem value="low">Baixa</SelectItem>
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
                                <SelectValue placeholder="Selecione" />
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
                          <FormLabel>Tipo</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="malware">Malware</SelectItem>
                              <SelectItem value="phishing">Phishing</SelectItem>
                              <SelectItem value="unauthorized-access">Acesso não autorizado</SelectItem>
                              <SelectItem value="data-breach">Vazamento de dados</SelectItem>
                              <SelectItem value="ddos">DDoS</SelectItem>
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
                          <Textarea {...field} placeholder="Detalhes adicionais (opcional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        className="w-full"
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="open">Abertos</TabsTrigger>
          <TabsTrigger value="investigating">Investigando</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          <TabsTrigger value="closed">Fechados</TabsTrigger>
        </TabsList>
        
        {showFilters && (
          <div className="bg-muted/40 p-4 rounded-lg mb-6 animate-slide-down">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filtros avançados</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Pesquisar</Label>
                <Input 
                  id="search" 
                  placeholder="Buscar incidentes..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as IncidentStatus | 'all')}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="investigating">Investigando</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="severity-filter">Severidade</Label>
                <Select 
                  value={severityFilter} 
                  onValueChange={(value) => setSeverityFilter(value as IncidentSeverity | 'all')}
                >
                  <SelectTrigger id="severity-filter">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type-filter">Tipo</Label>
                <Select 
                  value={typeFilter} 
                  onValueChange={(value) => setTypeFilter(value as IncidentType | 'all')}
                >
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="malware">Malware</SelectItem>
                    <SelectItem value="phishing">Phishing</SelectItem>
                    <SelectItem value="unauthorized-access">Acesso não autorizado</SelectItem>
                    <SelectItem value="data-breach">Vazamento de dados</SelectItem>
                    <SelectItem value="ddos">DDoS</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        )}
        
        <TabsContent value={selectedTab} className="mt-0 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando incidentes...</span>
            </div>
          ) : filteredIncidents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  id={incident.id}
                  title={incident.title}
                  description={incident.description}
                  severity={incident.severity}
                  status={incident.status}
                  type={incident.type}
                  createdAt={incident.createdAt!}
                  updatedAt={incident.updatedAt!}
                  assignedTo={incident.assignedTo}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">Nenhum incidente encontrado</h3>
              <p className="text-muted-foreground max-w-md mt-1">
                Não há incidentes que correspondam aos filtros selecionados. Tente ajustar seus filtros ou criar um novo incidente.
              </p>
              <Button className="mt-4 gap-2" variant="outline" onClick={resetFilters}>
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentList;
