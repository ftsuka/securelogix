
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6 py-16 bg-card rounded-lg shadow-sm border border-border/50 animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Página não encontrada</p>
        <Button asChild className="transition-all duration-300 hover:scale-105">
          <a href="/">Retornar ao Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
