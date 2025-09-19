import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import Index from "./pages/Index";
import OnboardingNew from "./pages/OnboardingNew";
import Profile from "./pages/Profile";
import WriteNew from "./pages/WriteNew";
import AIMatch from "./pages/FeedNew";
import ConnectionsNew from "./pages/ConnectionsNew";
import PastLettersNew from "./pages/PastLettersNew";
import InboxNew from "./pages/InboxNew";
import Events from "./pages/Events";
import ChatNew from "./pages/ChatNew";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import TestNotifications from "./pages/TestNotifications";

const queryClient = new QueryClient();

// Component to handle service worker navigation messages
function ServiceWorkerNavigationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'NAVIGATE_TO') {
          console.log('[App] Navigating to:', event.data.url);
          navigate(event.data.url);
        }
      };

      navigator.serviceWorker.addEventListener('message', messageHandler);

      return () => {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      };
    }
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BackgroundProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ServiceWorkerNavigationHandler />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/onboarding" element={<OnboardingNew />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/write" element={<WriteNew />} />
              <Route path="/feed" element={<AIMatch />} />
              <Route path="/connections" element={<ConnectionsNew />} />
              <Route path="/past-letters" element={<PastLettersNew />} />
              <Route path="/inbox" element={<InboxNew />} />
              <Route path="/events" element={<Events />} />
              <Route path="/chat" element={<ChatNew />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BackgroundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
