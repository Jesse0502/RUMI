import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import Index from "./pages/Index";
import OnboardingNew from "./pages/OnboardingNew";
import Profile from "./pages/Profile";
import WriteNew from "./pages/WriteNew";
import FeedNew from "./pages/FeedNew";
import ConnectionsNew from "./pages/ConnectionsNew";
import PastLettersNew from "./pages/PastLettersNew";
import InboxNew from "./pages/InboxNew";
import Events from "./pages/Events";
import ChatNew from "./pages/ChatNew";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BackgroundProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/onboarding" element={<OnboardingNew />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/write" element={<WriteNew />} />
              <Route path="/feed" element={<FeedNew />} />
              <Route path="/connections" element={<ConnectionsNew />} />
              <Route path="/past-letters" element={<PastLettersNew />} />
              <Route path="/inbox" element={<InboxNew />} />
              <Route path="/events" element={<Events />} />
              <Route path="/chat" element={<ChatNew />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BackgroundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
