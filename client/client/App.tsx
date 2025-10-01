import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import Index from "./pages/Index";
import OnboardingNew from "./pages/Onboarding";
import Profile from "./pages/Profile";
import WriteNew from "./pages/WriteNew";
import AIMatch from "./pages/FeedNew";
import ConnectionsNew from "./pages/ConnectionsNew";
import InboxNew from "./pages/InboxNew";
import Events from "./pages/Events";
import ChatNew from "./pages/ChatNew";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import TestNotifications from "./pages/TestNotifications";
import ExtProfile from "./pages/ExtProfile";
import TermsPrivacyPage from "./pages/TermsPrivacyPage";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { ToasterProvider } from "./components/common/Toaster";
import LoginPage from "./pages/GetStarted";
import GetStartedPage from "./pages/GetStarted";
import { AuthProvider } from "./contexts/AuthProvider";

// const queryClient = new QueryClient();

// Component to handle service worker navigation messages
function ServiceWorkerNavigationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === "NAVIGATE_TO") {
          console.log("[App] Navigating to:", event.data.url);
          navigate(event.data.url);
        }
      };

      navigator.serviceWorker.addEventListener("message", messageHandler);

      return () => {
        navigator.serviceWorker.removeEventListener("message", messageHandler);
      };
    }
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      {/* <QueryClientProvider client={queryClient}> */}
      <TooltipProvider>
        <ToasterProvider>
          <BackgroundProvider>
            {/* <Toaster />
            <Sonner /> */}
            <BrowserRouter>
              <ServiceWorkerNavigationHandler />
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/onboarding" element={<OnboardingNew />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:id" element={<ExtProfile />} />
                  <Route path="/terms" element={<TermsPrivacyPage />} />
                  <Route path="/get-started" element={<GetStartedPage />} />
                  <Route path="/write" element={<WriteNew />} />
                  <Route path="/feed" element={<AIMatch />} />
                  <Route path="/connections" element={<ConnectionsNew />} />
                  <Route path="/inbox" element={<InboxNew />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/chat" element={<ChatNew />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route
                    path="/test-notifications"
                    element={<TestNotifications />}
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </BackgroundProvider>
        </ToasterProvider>
      </TooltipProvider>
      {/* </QueryClientProvider> */}
    </Provider>
  );
}
