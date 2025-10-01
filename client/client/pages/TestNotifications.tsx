import LayoutNew from "@/components/common/LayoutNew";
import { useState } from "react";
import { Bell, Send, Users, Mail, Calendar } from "lucide-react";
import {
  sendPushNotification,
  notifyNewMessage,
  notifyConnectionRequest,
  notifyConnectionAccepted,
  notifyAIMatch,
  notifyEventReminder,
  checkNotificationSupport,
} from "@/lib/notifications";
import { runWebSocketDiagnostics } from "@/lib/websocket-test";
import { toast } from "sonner";

export default function TestNotifications() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const notificationSupport = checkNotificationSupport();

  const runDiagnostics = async () => {
    setIsDiagnosticRunning(true);
    try {
      await runWebSocketDiagnostics();
      toast.success("WebSocket diagnostics completed!", {
        description: "Check the browser console for detailed results",
        duration: 4000,
      });
    } catch (error) {
      toast.error("Diagnostics failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsDiagnosticRunning(false);
    }
  };

  const testNotifications = [
    {
      title: "New Message",
      description: "Test inbox message notification",
      icon: Mail,
      action: () =>
        notifyNewMessage("Test User", "Hello! This is a test message"),
      color: "blue",
    },
    {
      title: "Connection Request",
      description: "Test connection request notification",
      icon: Users,
      action: () => notifyConnectionRequest("Sarah Chen", "user123"),
      color: "green",
    },
    {
      title: "Connection Accepted",
      description: "Test connection accepted notification",
      icon: Users,
      action: () => notifyConnectionAccepted("John Doe", "user456"),
      color: "purple",
    },
    {
      title: "AI Match Found",
      description: "Test AI match notification",
      icon: Bell,
      action: () =>
        notifyAIMatch("Alex Rodriguez", "Shared interests in design and tech"),
      color: "orange",
    },
    {
      title: "Event Reminder",
      description: "Test event reminder notification",
      icon: Calendar,
      action: () => notifyEventReminder("Design Workshop", "30 minutes"),
      color: "red",
    },
    {
      title: "Custom Notification",
      description: "Send custom notification",
      icon: Send,
      action: () =>
        sendPushNotification({
          title: "Custom Test Notification 🔔",
          body: "This is a custom test notification with custom data",
          data: {
            url: "/settings",
            type: "test",
            // customData: "test123",
          },
        }),
      color: "gray",
    },
  ];

  const handleTestNotification = async (
    testFn: () => Promise<any>,
    testName: string,
  ) => {
    setIsLoading(true);
    try {
      await testFn();
      toast.success(`${testName} sent successfully!`, {
        description: "Check your notifications",
        duration: 3000,
      });
    } catch (error) {
      console.error(`Error sending ${testName}:`, error);
      toast.error(`Failed to send ${testName}`, {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      green: "bg-green-100 text-green-700 hover:bg-green-200",
      purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      orange: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      red: "bg-red-100 text-red-700 hover:bg-red-200",
      gray: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Test Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Test PWA push notification functionality
          </p>
        </div>

        {/* Notification Support Status */}
        <div className="card-elevated p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notification Support Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${notificationSupport.supported ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span className="text-sm">
                Browser Support:{" "}
                {notificationSupport.supported ? "Supported" : "Not Supported"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  notificationSupport.permission === "granted"
                    ? "bg-green-500"
                    : notificationSupport.permission === "denied"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-sm">
                Permission Status: {notificationSupport.permission}
              </span>
            </div>
          </div>

          {notificationSupport.permission !== "granted" && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You need to enable notifications first
                using the bell icon in the top navigation.
              </p>
            </div>
          )}
        </div>

        {/* WebSocket Diagnostics */}
        <div className="card-elevated p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            WebSocket Diagnostics
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Test WebSocket connection to the AI service and debug connection
            issues.
          </p>
          <button
            onClick={runDiagnostics}
            disabled={isDiagnosticRunning}
            className={`btn-primary ${isDiagnosticRunning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isDiagnosticRunning
              ? "Running Diagnostics..."
              : "Run WebSocket Diagnostics"}
          </button>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Diagnostic results will appear in the
              browser console. Check DevTools Console for detailed information.
            </p>
          </div>
        </div>

        {/* Test Notification Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testNotifications.map((test, index) => (
            <div key={index} className="card-elevated p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(test.color)}`}
                >
                  <test.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {test.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {test.description}
                  </p>
                  <button
                    onClick={() =>
                      handleTestNotification(test.action, test.title)
                    }
                    disabled={
                      isLoading || notificationSupport.permission !== "granted"
                    }
                    className={`btn-primary text-sm ${
                      notificationSupport.permission !== "granted"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isLoading ? "Sending..." : "Send Test"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="card-elevated p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How to Test
          </h2>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>
              1. Click the bell icon in the navigation to enable notifications
            </li>
            <li>2. Allow notification permission when prompted</li>
            <li>3. Click any of the test buttons above</li>
            <li>4. Check your browser/system notifications</li>
            <li>5. Click on notifications to test navigation functionality</li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Each notification type includes specific
              data that will navigate you to the relevant page when clicked.
            </p>
          </div>
        </div>
      </div>
    </LayoutNew>
  );
}
