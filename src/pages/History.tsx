
import { Layout } from '@/components/Dashboard/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Archive, Clock, Search } from 'lucide-react';
import { fetchIncidents } from '@/services/incidentService';
import { Incident } from '@/components/Incidents/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const History = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const itemsPerPage = 10;

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        // Sort by date, newest first
        const sortedIncidents = data.sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        setIncidents(sortedIncidents);
        setFilteredIncidents(sortedIncidents);
      } catch (error) {
        console.error('Erro ao carregar histórico de incidentes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = incidents;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(incident => 
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(incident => incident.type === typeFilter);
    }
    
    setFilteredIncidents(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, typeFilter, incidents]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const pageNumbers = [];
  
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Histórico de Incidentes</h2>
            <p className="text-muted-foreground">Registro completo de todos os incidentes</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar incidentes..."
              type="search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
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

        {loading ? (
          <div className="w-full">
            <div className="flex justify-center items-center h-64">
              <Clock className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando histórico...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Severidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedIncidents.length > 0 ? (
                    paginatedIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">
                          {incident.createdAt && format(new Date(incident.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>{incident.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {incident.type.replace(/-/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getSeverityColor(incident.severity)} hover:opacity-85`}>
                            {incident.severity === 'critical' ? 'Crítico' : 
                             incident.severity === 'high' ? 'Alto' :
                             incident.severity === 'medium' ? 'Médio' : 'Baixo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getStatusColor(incident.status)} hover:opacity-85`}>
                            {incident.status === 'open' ? 'Aberto' : 
                             incident.status === 'investigating' ? 'Investigando' :
                             incident.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/incident/${incident.id}`}>
                              Ver Detalhes
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum resultado encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink 
                        isActive={currentPage === number}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default History;
