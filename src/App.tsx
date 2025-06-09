
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
import { createClient } from "@supabase/supabase-js";


const queryClient = new QueryClient();
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);



const App = () => {
  const routingKey = 'CTC/access360/49240044/dyn/vib/notify/lite';
  useMqtt(routingKey);
  
  return(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/vibra-vista-dashboard/">
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
