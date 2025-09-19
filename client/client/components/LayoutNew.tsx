import {
  User,
  PenTool,
  Users,
  Mail,
  Inbox,
  Bell,
  Settings,
  Calendar,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useBackground,
  getBackgroundClasses,
} from "@/contexts/BackgroundContext";
import BackgroundSwitcher from "@/components/BackgroundSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

export default function LayoutNew({ children }: LayoutProps) {
  const location = useLocation();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  // Get background context with fallback
  const backgroundContext = useBackground();
  const backgroundType = backgroundContext?.backgroundType || "solid";
  const solidColor = backgroundContext?.solidColor || "#f9fafb";
  const backgroundProps = getBackgroundClasses(backgroundType, solidColor);

  // Check notification permission status on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);

      // Check if already subscribed
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
          reg.pushManager.getSubscription().then(subscription => {
            if (subscription) {
              setNotifEnabled(true);
            }
          }).catch(error => {
            console.warn('Error checking push subscription:', error);
          });
        });
      }
    }
  }, []);

  const navigationItems = [
    {
      path: "/feed",
      icon: PenTool,
      label: "AI Match",
      description: "AI conversations",
    },
    // {
    //   path: "/write",
    //   icon: Mail,
    //   label: "Write",
    //   description: "Compose letter",
    // },
    {
      path: "/events",
      icon: Calendar,
      label: "Events",
      description: "Upcoming events",
    },
    {
      path: "/connections",
      icon: Users,
      label: "Connections",
      description: "Your network",
    },
    { path: "/inbox", icon: Inbox, label: "Inbox", description: "Messages" },

    // {
    //   path: "/past-letters",
    //   icon: Mail,
    //   label: "Letters",
    //   description: "Your letters",
    // },
  ];

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser");
      return;
    }

    if (!("Notification" in window)) {
      alert("This browser does not support notifications");
      return;
    }

    try {
      // Request notification permission first
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotifPermission(permission);

        if (permission !== 'granted') {
          alert("Notification permission denied. You can enable it later in browser settings.");
          return;
        }
      } else if (Notification.permission === 'denied') {
        alert("Notifications are blocked. Please enable them in your browser settings.");
        return;
      }

      const reg = await navigator.serviceWorker.register("/service-worker.js");
      await navigator.serviceWorker.ready; // Wait for service worker to be ready

      const vapidRes = await fetch("/api/vapid");
      if (!vapidRes.ok) {
        throw new Error(`Failed to fetch VAPID key: ${vapidRes.status}`);
      }
      const { publicKey } = await vapidRes.json();

      function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

      // Check if already subscribed
      const existingSubscription = await reg.pushManager.getSubscription();
      if (existingSubscription) {
        setNotifEnabled(true);
        alert("Push notifications are already enabled!");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subscribeRes = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      if (!subscribeRes.ok) {
        throw new Error(`Failed to subscribe: ${subscribeRes.status}`);
      }

      setNotifEnabled(true);
      setNotifPermission('granted');

      // Send a test notification
      setTimeout(() => {
        sendTestNotification();
      }, 1000);

      alert("Push notifications enabled! You should receive a test notification shortly.");
    } catch (error) {
      console.error("Error enabling push notifications:", error);
      alert(`Error enabling push notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Send a test notification
  async function sendTestNotification() {
    try {
      await fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "RUMI Notifications Enabled! 🎉",
          body: "You'll now receive notifications for new messages, connections, and matches.",
          data: { url: "/inbox", type: "welcome" }
        }),
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  }

  return (
    <div
      className={`min-h-screen ${backgroundProps.className}`}
      style={backgroundProps.style}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold text-rumi-purple">
                  rumi
                </h1>
                <span className="text-lg">✨</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={enablePush}
                className={`p-2 rounded-lg transition-all relative ${
                  notifEnabled
                    ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    : notifPermission === 'denied'
                    ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={
                  notifEnabled
                    ? 'Notifications enabled'
                    : notifPermission === 'denied'
                    ? 'Notifications blocked - click to learn how to enable'
                    : 'Enable notifications'
                }
              >
                <Bell className="w-5 h-5" />
                {notifEnabled && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {notifPermission === 'denied' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </button>
              <Link
                to="/profile"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-auto">
          <div className="content-width section-padding py-6">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="sticky bottom-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <div className="flex">
            {navigationItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all ${
                    isActive
                      ? "text-rumi-purple bg-rumi-purple-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/profile"
              className="flex-1 flex flex-col items-center gap-1 py-3 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold text-rumi-purple">
                rumi
              </h1>
              <span className="text-xl">✨</span>
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Connect through meaningful letters
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Theme Settings */}
          {/* <div className="p-4 border-t border-gray-200">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Theme Settings
              </h3>
              <BackgroundSwitcher />
            </div>
          </div> */}

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all flex-1"
              >
                <div className="w-8 h-8 bg-rumi-purple rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Profile</div>
                  <div className="text-xs text-gray-500">View & edit</div>
                </div>
              </Link>

              <button
                onClick={enablePush}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all ml-2"
                title="Enable notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="content-width section-padding py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
