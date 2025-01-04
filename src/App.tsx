import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import Login from "./pages/Login";
import AdsAnalytics from "./pages/AdsAnalytics";
import CreateAd from "./pages/CreateAd";
import AdsList from "./pages/AdsList";
import Advertisers from "./pages/Advertisers";
import Campaigns from "./pages/Campaigns";
import EditAd from "./pages/EditAd";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdsAnalytics />} />
              <Route path="ads" element={<AdsList />} />
              <Route path="ads/create" element={<CreateAd />} />
              <Route path="ads/edit/:id" element={<EditAd />} />
              <Route path="advertisers" element={<Advertisers />} />
              <Route path="campaigns" element={<Campaigns />} />
            </Route>
            <Route path="*" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
