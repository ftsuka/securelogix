
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import IncidentDetails from "./pages/IncidentDetails";
import Alerts from "./pages/Alerts";
import Resolved from "./pages/Resolved";
import History from "./pages/History";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import insertSampleData from "./utils/insertSampleData";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => {
  // Inserir dados de exemplo ao iniciar o aplicativo
  useEffect(() => {
    insertSampleData().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Rotas protegidas */}
                <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/incidents" element={<AuthGuard><Index /></AuthGuard>} />
                <Route path="/incident/:id" element={<AuthGuard><IncidentDetails /></AuthGuard>} />
                <Route path="/alerts" element={<AuthGuard><Alerts /></AuthGuard>} />
                <Route path="/resolved" element={<AuthGuard><Resolved /></AuthGuard>} />
                <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
                <Route path="/team" element={<AuthGuard><Team /></AuthGuard>} />
                <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                <Route path="/logout" element={<AuthGuard><Logout /></AuthGuard>} />
                
                {/* Redirecionar / para /dashboard para usuários autenticados pela Sidebar */}
                <Route path="/index" element={<Navigate to="/incidents" replace />} />
                
                {/* Rota 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
