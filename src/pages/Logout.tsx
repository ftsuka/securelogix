
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/services/authService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const success = await logoutUser();
      if (success) {
        // Redirecionamento após logout bem-sucedido
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // Em caso de erro, voltar para a página anterior
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Saindo</CardTitle>
          <CardDescription>Encerrando sua sessão...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar para o início
          </Button>
          <Button variant="default">
            <LogOut className="mr-2 h-4 w-4" />
            Saindo...
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Logout;
