
import { Layout } from '@/components/Dashboard/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bell, Shield } from 'lucide-react';
import { fetchIncidents } from '@/services/incidentService';
import { Incident } from '@/components/Incidents/types';
import { useEffect, useState } from 'react';
import { IncidentCard } from '@/components/Incidents/IncidentCard';
import { Skeleton } from '@/components/ui/skeleton';

const Alerts = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        // Filter only open or investigating incidents that have high or critical severity
        const alertIncidents = data.filter(
          (incident) => 
            (incident.status === 'open' || incident.status === 'investigating') && 
            (incident.severity === 'high' || incident.severity === 'critical')
        );
        setIncidents(alertIncidents);
      } catch (error) {
        console.error('Erro ao carregar alertas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Alertas</h2>
            <p className="text-muted-foreground">Incidentes que requerem atenção imediata</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  incidents.filter(i => i.severity === 'critical').length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Exigem atenção imediata
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Alta Prioridade</CardTitle>
              <Bell className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  incidents.filter(i => i.severity === 'high').length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Requerem atenção rápida
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
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
                Em todos os níveis de severidade
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
                type={incident.type as IncidentType}
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
            <h3 className="font-medium text-lg">Nenhum alerta encontrado</h3>
            <p className="text-muted-foreground max-w-md mt-1">
              Não há incidentes críticos ou de alta prioridade que necessitem de atenção imediata no momento.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;
