
import { NavLink } from "react-router-dom";
import { Layout, Settings, BarChart, Menu ,BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}



const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, toggleSidebar}) => {
  const navItems = [
    {
      name: "Panel General",
      path: "/",
      icon: <Layout className="w-5 h-5" />,
    },
    {
      name: "Visualización",
      path: "/visualization",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      name: "Alarmas",
      path: "/alarm",
      icon: <BellRing className="w-5 h-5" />,
    },
    {
      name: "Configuración",
      path: "/configuration",
      icon: <Settings className="w-5 h-5" />,
    },
    
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-dashboard-header transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
        >
          <Menu className="h-5 w-5 text-white " />
        </Button>
        <div className={cn("flex items-center", isOpen ? "px-4" : "px-0")}>
          
          {isOpen && (
            <span className="ml-2 font-semibold text-white">
              Panel 
            </span>
          )}
        </div>
      </div>
      <hr className="mx-6"></hr>
      <div className="mt-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-3 rounded-md transition-all duration-200", // Agregar duración
                  isActive
                    ? "bg-slate-600 text-white shadow-md " // Mejor contraste/sombra
                    : "text-gray-300 hover:bg-gray-900 hover:text-white", // Fondo hover más definido
                  !isOpen && "justify-center"
                )
              }
            >
              {item.icon}
              {isOpen && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
