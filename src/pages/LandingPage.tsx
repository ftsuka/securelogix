
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogIn, UserPlus, BarChart, Shield, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar para o dashboard se o usuário já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold">SecureLogix</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth?tab=signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Gestão de Incidentes de Segurança Simplificada
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitore, analise e responda rapidamente a incidentes de segurança com nossa plataforma intuitiva.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Começar agora
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#features">
                  Saiba mais
                </a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 bg-primary/5 p-8 rounded-xl border border-border">
            <div className="aspect-video bg-card rounded-lg border border-border flex items-center justify-center">
              <ShieldAlert className="w-16 h-16 text-primary opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="features" className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recursos Principais</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma oferece ferramentas poderosas para gerenciar eficientemente incidentes de segurança.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Analítico</h3>
              <p className="text-muted-foreground">
                Visualize métricas e tendências de incidentes em tempo real.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Alertas</h3>
              <p className="text-muted-foreground">
                Priorize e responda rapidamente a incidentes críticos.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resolução de Incidentes</h3>
              <p className="text-muted-foreground">
                Acompanhe o progresso e resolva incidentes de forma eficiente.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Histórico Detalhado</h3>
              <p className="text-muted-foreground">
                Mantenha um registro completo de todos os incidentes passados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para melhorar sua segurança?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Cadastre-se agora e comece a gerenciar incidentes de segurança de forma mais eficiente.
        </p>
        <Button size="lg" asChild>
          <Link to="/auth">
            Criar conta gratuita
          </Link>
        </Button>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">SecureLogix</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SecureLogix. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
