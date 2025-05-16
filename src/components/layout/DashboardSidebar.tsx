
import { NavLink } from "react-router-dom";
import { Layout, Settings, BarChart, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const navItems = [
    {
      name: "Panel General",
      path: "/",
      icon: <Layout className="w-5 h-5" />,
    },
    {
      name: "Configuración",
      path: "/configuration",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Visualización",
      path: "/visualization",
      icon: <BarChart className="w-5 h-5" />,
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
        <div className={cn("flex items-center", isOpen ? "px-4" : "px-0")}>
          <Activity className="h-8 w-8 text-brand-DEFAULT" />
          {isOpen && (
            <span className="ml-2 font-semibold text-white">
              VibSensor
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-3 rounded-md transition-all",
                  isActive
                    ? "bg-brand-DEFAULT text-white"
                    : "text-gray-300 hover:bg-dashboard-header hover:text-white",
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
