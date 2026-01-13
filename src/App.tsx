// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

// Main App Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminSettings from "@/pages/admin/Settings";
import AdminWelcome from "@/pages/admin/Welcome";

// Layouts
import MainLayout from "@/components/layouts/MainLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// Auth Guard
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Desktop Block Screen
import DesktopBlockScreen from "@/components/DesktopBlockScreen";

// Welcome Screen
import WelcomeScreen from "@/components/WelcomeScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  const [isMobile, setIsMobile] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [checkingWelcome, setCheckingWelcome] = useState(true);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    // Check if user has seen welcome screen
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    setShowWelcome(!hasSeenWelcome);
    setCheckingWelcome(false);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  // Show desktop block screen if not mobile
  if (!isMobile) {
    return <DesktopBlockScreen />;
  }

  // Show loading while checking welcome status
  if (checkingWelcome) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
        
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Main App Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="profile" element={<div className="p-4">Profile Page</div>} />
              <Route path="notifications" element={<div className="p-4">Notifications</div>} />
            </Route>

            {/* Admin Routes - Protected */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="welcome" element={<AdminWelcome />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
