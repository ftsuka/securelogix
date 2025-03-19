
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ShieldAlert, 
  BarChart, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  path, 
  active = false,
  onClick
}) => {
  return (
    <Link 
      to={path} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 group",
        active 
          ? "bg-primary text-white" 
          : "text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
      )}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 flex flex-col bg-sidebar border-r border-border z-40",
          "w-64 transition-transform duration-300 ease-in-out",
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          !isMobile && "translate-x-0",
          className
        )}
      >
        <div className="flex items-center justify-center h-16 px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">SecureLogix</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem 
            icon={<ShieldAlert size={18} />} 
            label="Incidentes" 
            path="/" 
            active={location.pathname === '/'} 
            onClick={closeSidebar}
          />
          <SidebarItem 
            icon={<BarChart size={18} />} 
            label="Dashboard" 
            path="/dashboard" 
            active={location.pathname === '/dashboard'} 
            onClick={closeSidebar}
          />
          <SidebarItem 
            icon={<AlertCircle size={18} />} 
            label="Alertas" 
            path="/alerts" 
            active={location.pathname === '/alerts'} 
            onClick={closeSidebar}
          />
          <SidebarItem 
            icon={<CheckCircle2 size={18} />} 
            label="Resolvidos" 
            path="/resolved" 
            active={location.pathname === '/resolved'} 
            onClick={closeSidebar}
          />
          <SidebarItem 
            icon={<Clock size={18} />} 
            label="Histórico" 
            path="/history" 
            active={location.pathname === '/history'} 
            onClick={closeSidebar}
          />
          <SidebarItem 
            icon={<Users size={18} />} 
            label="Equipe" 
            path="/team" 
            active={location.pathname === '/team'} 
            onClick={closeSidebar}
          />
        </nav>
        
        <div className="p-4 space-y-1 border-t border-border">
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Configurações" 
            path="/settings" 
            active={location.pathname === '/settings'} 
            onClick={closeSidebar}
          />
          <SidebarItem 
            icon={<LogOut size={18} />} 
            label="Sair" 
            path="/logout" 
            onClick={closeSidebar}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
