
import React from 'react';
import StatCard from './StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Clock, CheckCircle, BarChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const recentActivityData = [
  { date: '01/06', total: 12 },
  { date: '02/06', total: 8 },
  { date: '03/06', total: 15 },
  { date: '04/06', total: 10 },
  { date: '05/06', total: 7 },
  { date: '06/06', total: 18 },
  { date: '07/06', total: 24 },
  { date: '08/06', total: 30 },
  { date: '09/06', total: 20 },
  { date: '10/06', total: 15 },
  { date: '11/06', total: 12 },
  { date: '12/06', total: 8 },
  { date: '13/06', total: 19 },
  { date: '14/06', total: 22 },
];

const incidentsByTypeData = [
  { name: 'Malware', value: 30 },
  { name: 'Phishing', value: 40 },
  { name: 'Acesso não autorizado', value: 15 },
  { name: 'Vazamento de dados', value: 10 },
  { name: 'DDoS', value: 5 },
];

const incidentsBySeverityData = [
  { name: 'Crítico', value: 20, color: '#ef4444' },
  { name: 'Alto', value: 30, color: '#f97316' },
  { name: 'Médio', value: 35, color: '#eab308' },
  { name: 'Baixo', value: 15, color: '#22c55e' },
];

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard de Segurança</h2>
        <p className="text-muted-foreground">Visão geral dos incidentes de segurança</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incidentes Totais"
          value={87}
          description="Últimos 30 dias"
          icon={<Shield className="h-6 w-6 text-primary" />}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Incidentes Abertos"
          value={23}
          description="Necessitam atenção"
          icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Tempo Médio de Resposta"
          value="1.8h"
          description="Meta: 2h"
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Taxa de Resolução"
          value="92%"
          description="Últimos 30 dias"
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Monitoramento de incidentes nas últimas 2 semanas
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="line">
              <TabsList className="mb-4">
                <TabsTrigger value="line">Linha</TabsTrigger>
                <TabsTrigger value="area">Área</TabsTrigger>
                <TabsTrigger value="bar">Barras</TabsTrigger>
              </TabsList>
              <TabsContent value="line" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recentActivityData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="area" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={recentActivityData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary)/0.2)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="bar" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={recentActivityData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                    />
                    <Bar 
                      dataKey="total" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Incidentes por Severidade</CardTitle>
            <CardDescription>
              Distribuição dos incidentes por nível de severidade
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentsBySeverityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {incidentsBySeverityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                    formatter={(value) => [`${value} incidentes`, 'Quantidade']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {incidentsBySeverityData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Incidentes por Tipo</CardTitle>
            <CardDescription>
              Distribuição dos incidentes por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  layout="vertical"
                  data={incidentsByTypeData}
                  margin={{ top: 5, right: 5, left: 100, bottom: 5 }}
                >
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    fontSize={12}
                    tickLine={false} 
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                    formatter={(value) => [`${value} incidentes`, 'Quantidade']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Incidentes Recentes</CardTitle>
                <CardDescription>
                  Últimos incidentes registrados
                </CardDescription>
              </div>
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Ataque DDoS à API pública</p>
                  <p className="text-xs text-muted-foreground">15 minutos atrás</p>
                </div>
                <div className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                  Crítico
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Campanha de phishing detectada</p>
                  <p className="text-xs text-muted-foreground">3 horas atrás</p>
                </div>
                <div className="px-2 py-1 text-xs rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  Alto
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Vazamento potencial de dados</p>
                  <p className="text-xs text-muted-foreground">12 horas atrás</p>
                </div>
                <div className="px-2 py-1 text-xs rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  Alto
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Malware detectado em estação de trabalho</p>
                  <p className="text-xs text-muted-foreground">2 dias atrás</p>
                </div>
                <div className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                  Resolvido
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
