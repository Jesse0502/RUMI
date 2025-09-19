import { User, PenTool, Users, Mail, Inbox, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  useBackground,
  getBackgroundClasses,
} from "@/contexts/BackgroundContext";
import BackgroundSwitcher from "@/components/BackgroundSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const { backgroundType, solidColor } = useBackground();
  const backgroundProps = getBackgroundClasses(backgroundType, solidColor);

  const navItems = [
    { icon: PenTool, label: "Write", path: "/write" },
    { icon: Users, label: "Connections", path: "/connections" },
    { icon: Mail, label: "Past Letters", path: "/past-letters" },
    { icon: Inbox, label: "Inbox", path: "/inbox" },
    { icon: PenTool, label: "Feed", path: "/feed" },
    { icon: Users, label: "Events", path: "/events" },
  ];

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser");
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register("/service-worker.js");
      const vapidRes = await fetch("/api/vapid");
      const { publicKey } = await vapidRes.json();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      setNotifEnabled(true);
      alert("Notifications enabled");
    } catch (err) {
      console.error(err);
      alert("Failed to enable notifications");
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${backgroundProps.className}`}
      style={backgroundProps.style}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden max-w-md mx-auto w-full flex flex-col min-h-screen">
        {/* Header - Sticky */}
        <header className="sticky top-0 z-50 bg-rumi-purple/95 backdrop-blur-sm text-white px-4 py-3 flex items-center justify-between shadow-lg border-b border-rumi-purple-light/20">
          <div className="flex items-center gap-2">
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              rumi
            </h1>
            <div className="text-xs">✨</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <BackgroundSwitcher />
            </div>
            <button
              onClick={enablePush}
              aria-label="enable-notifications"
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-105"
            >
              <Bell className="w-4 h-4 text-rumi-purple" />
            </button>
            <Link
              to="/profile"
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-105"
            >
              <User className="w-5 h-5 text-rumi-purple" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>

        {/* Bottom Navigation - Sticky */}
        <nav className="sticky bottom-0 z-50 border-t bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg border-t border-gray-200">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "text-rumi-purple"
                      : "text-gray-500 hover:text-rumi-purple"
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span
                    className="text-xs font-medium"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar - Sticky */}
        <aside className="sticky top-0 h-screen w-64 bg-rumi-purple/95 backdrop-blur-sm text-white flex flex-col shadow-xl border-r border-rumi-purple-light/20">
          {/* Logo */}
          <div className="p-6 border-b border-rumi-purple-light/30">
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                rumi
              </h1>
              <div className="text-lg">✨</div>
            </div>
            <p
              className="text-sm opacity-75 mt-2"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Connect through letters
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-rumi-purple-light text-white"
                        : "text-gray-200 hover:bg-rumi-purple-light hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span
                      className="font-medium"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Background Switcher */}
          <div className="p-4 border-t border-rumi-purple-light/30">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white/80 mb-2">
                Theme Settings
              </h3>
              <BackgroundSwitcher />
            </div>
          </div>

          {/* Profile */}
          <div className="p-4 border-t border-rumi-purple-light/30 flex items-center justify-between">
            <Link
              to="/profile"
              className="flex items-center gap-3 py-3 px-4 rounded-lg transition-all text-gray-200 hover:bg-rumi-purple-light/50 hover:text-white hover:scale-105"
            >
              <User className="w-5 h-5" />
              <span
                className="font-medium"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Profile
              </span>
            </Link>
            <button
              onClick={enablePush}
              aria-label="enable-notifications"
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-105"
            >
              <Bell className="w-4 h-4 text-rumi-purple" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
