
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
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between h-24">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/51a3b95a-4eef-4ce0-94d7-ac5f812b73f9.png" 
            alt="PYMEX Logo" 
            className="h-28 w-auto"
          />
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-xl font-medium text-dashboard-text">{title}</h1>
        </div>
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
