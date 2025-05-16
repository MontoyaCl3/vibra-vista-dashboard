
import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Panel General";
    if (path === "/configuration") return "Configuración de Sensores";
    if (path === "/visualization") return "Visualización de Datos";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-dashboard-background">
      <DashboardSidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <DashboardHeader 
          title={getPageTitle()} 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
