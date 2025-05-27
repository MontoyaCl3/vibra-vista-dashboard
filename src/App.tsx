
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Configuration from "./pages/Configuration";
import Visualization from "./pages/Visualization";
import NotFound from "./pages/NotFound";
import useMqtt from "./hooks/useMqtt";

const queryClient = new QueryClient();

const App = () => {
  const routingKey = 'CTC/access360/49240044/dyn/vib/notify/lite';
  const messages = useMqtt(routingKey);

  return(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/configuration" 
            element={
              <DashboardLayout>
                <Configuration />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/visualization" 
            element={
              <DashboardLayout>
                <Visualization />
              </DashboardLayout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  )
};

export default App;
