
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter  } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AlarmRecord from "./pages/AlarmRecord";
import Configuration from "./pages/Configuration";
import Visualization from "./pages/Visualization";
import NotFound from "./pages/NotFound";
import useMqtt from "./hooks/useMqtt";
import { createClient } from "@supabase/supabase-js";


const queryClient = new QueryClient();

const SUPABASE_URL = "https://hnncwhncrdyeplgswytf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhubmN3aG5jcmR5ZXBsZ3N3eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzA3NTMsImV4cCI6MjA2Mzk0Njc1M30.F2H4FKlCZRZIhK9Jakqwp4IDx4wwxUSr4q6Y3lFEsgA";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const App = () => {
  const routingKey = 'CTC/access360/49240044/dyn/vib/notify/lite';
  useMqtt(routingKey);
  
  return(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter >
        
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
            path="/alarm" 
            element={
              <DashboardLayout>
                <AlarmRecord />
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
      </HashRouter >
    </TooltipProvider>
  </QueryClientProvider>
  )
};

export default App;
