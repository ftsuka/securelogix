
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Sessão encerrada",
      description: "Você saiu com sucesso",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao sair:", error);
    toast({
      title: "Erro ao sair",
      description: "Ocorreu um erro inesperado",
      variant: "destructive",
    });
    return false;
  }
};
