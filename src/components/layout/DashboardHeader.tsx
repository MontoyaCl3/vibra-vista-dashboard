
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  toggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-dashboard-secondaryText">
          Sistema de Monitoreo de Vibraciones
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
