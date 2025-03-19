
import { Layout } from '@/components/Dashboard/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Shield } from 'lucide-react';
import { fetchIncidents } from '@/services/incidentService';
import { Incident } from '@/components/Incidents/types';
import { useEffect, useState } from 'react';
import { IncidentCard } from '@/components/Incidents/IncidentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Resolved = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        // Filter only resolved incidents
        const resolvedIncidents = data.filter(
          (incident) => incident.status === 'resolved' || incident.status === 'closed'
        );
        setIncidents(resolvedIncidents);
      } catch (error) {
        console.error('Erro ao carregar incidentes resolvidos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  // Calculate resolution stats
  const getAverageResolutionTime = () => {
    if (!incidents.length) return '0';
    
    let totalDays = 0;
    let count = 0;
    
    incidents.forEach(incident => {
      if (incident.createdAt && incident.updatedAt) {
        const days = differenceInDays(new Date(incident.updatedAt), new Date(incident.createdAt));
        totalDays += days;
        count++;
      }
    });
    
    return count ? (totalDays / count).toFixed(1) : '0';
  };

  const getResolvedLastMonth = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    return incidents.filter(incident => 
      incident.updatedAt && new Date(incident.updatedAt) > lastMonth
    ).length;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Incidentes Resolvidos</h2>
            <p className="text-muted-foreground">Histórico de incidentes solucionados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resolvidos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  incidents.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Incidentes solucionados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidos no Último Mês</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  getResolvedLastMonth()
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Nos últimos 30 dias
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio de Resolução</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  `${getAverageResolutionTime()} dias`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Da abertura até a resolução
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-48">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : incidents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incidents.map((incident) => (
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
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">Nenhum incidente resolvido</h3>
            <p className="text-muted-foreground max-w-md mt-1">
              Não há incidentes resolvidos ou fechados para mostrar no momento.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Resolved;
