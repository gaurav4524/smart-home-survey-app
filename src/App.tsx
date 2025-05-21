
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeProvider } from "./context/HomeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoomDetailScreen from "./screens/RoomDetailScreen";
import SceneScreen from "./screens/SceneScreen";
import MonitorScreen from "./screens/MonitorScreen";
import ProfileScreen from "./screens/ProfileScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HomeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/room/:roomId" element={<RoomDetailScreen />} />
            <Route path="/scenes" element={<SceneScreen />} />
            <Route path="/monitoring" element={<MonitorScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HomeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
