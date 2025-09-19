// WebSocket debugging and testing utilities

import { debugError, debugLog, getWebSocketEventInfo, getBrowserInfo } from './debug';

/**
 * Test WebSocket connection with detailed logging
 */
export function testWebSocketConnection(url: string = "ws://localhost:8000/ws"): Promise<{
  success: boolean;
  error?: string;
  details: any;
}> {
  return new Promise((resolve) => {
    debugLog("🔍 Testing WebSocket connection to:", url);
    
    let socket: WebSocket;
    let resolved = false;
    
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        debugError("⏰ WebSocket connection test timed out");
        if (socket) {
          socket.close();
        }
        resolve({
          success: false,
          error: "Connection timeout after 5 seconds",
          details: {
            url,
            browserInfo: getBrowserInfo(),
            timeout: 5000
          }
        });
      }
    }, 5000);

    try {
      socket = new WebSocket(url);
      
      socket.onopen = (event) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          debugLog("✅ WebSocket connection test successful");
          socket.close(1000, "Test completed");
          resolve({
            success: true,
            details: {
              url,
              eventInfo: getWebSocketEventInfo(event),
              browserInfo: getBrowserInfo()
            }
          });
        }
      };
      
      socket.onerror = (event) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          debugError("❌ WebSocket connection test failed:", {
            eventInfo: getWebSocketEventInfo(event),
            browserInfo: getBrowserInfo()
          });
          resolve({
            success: false,
            error: "Connection failed",
            details: {
              url,
              eventInfo: getWebSocketEventInfo(event),
              browserInfo: getBrowserInfo()
            }
          });
        }
      };
      
      socket.onclose = (event) => {
        debugLog("🔒 WebSocket connection test closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
      };
      
    } catch (error) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        debugError("❌ Failed to create WebSocket for testing:", error);
        resolve({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          details: {
            url,
            error,
            browserInfo: getBrowserInfo()
          }
        });
      }
    }
  });
}

/**
 * Run comprehensive WebSocket diagnostics
 */
export async function runWebSocketDiagnostics() {
  debugLog("🔧 Running WebSocket diagnostics...");

  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

  const results = {
    environment: {
      isProduction,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      shouldUseWebSocket: !isProduction
    },
    browserSupport: {
      webSocket: 'WebSocket' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notification: 'Notification' in window
    },
    browserInfo: getBrowserInfo(),
    connectionTests: [] as any[]
  };
  
  if (isProduction) {
    // In production, don't test WebSocket connections to localhost
    results.connectionTests.push({
      url: "N/A",
      success: false,
      error: "WebSocket testing skipped in production environment",
      details: {
        message: "App is running in production mode with demo responses",
        recommendation: "WebSocket connections are only available in development (localhost)"
      }
    });
  } else {
    // Test different URLs only in development
    const testUrls = [
      "ws://localhost:8000/ws",
      "ws://127.0.0.1:8000/ws",
      "wss://localhost:8000/ws"
    ];

    for (const url of testUrls) {
      try {
        const result = await testWebSocketConnection(url);
        results.connectionTests.push({
          url,
          ...result
        });
      } catch (error) {
        results.connectionTests.push({
          url,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          details: { error }
        });
      }
    }
  }
  
  debugLog("📊 WebSocket diagnostics complete:", results);
  return results;
}

/**
 * Get WebSocket ready state as human readable string
 */
export function getWebSocketState(socket: WebSocket | null): string {
  if (!socket) return 'No socket';
  
  switch (socket.readyState) {
    case WebSocket.CONNECTING: return 'CONNECTING';
    case WebSocket.OPEN: return 'OPEN';
    case WebSocket.CLOSING: return 'CLOSING';
    case WebSocket.CLOSED: return 'CLOSED';
    default: return `UNKNOWN (${socket.readyState})`;
  }
}

/**
 * Check if WebSocket errors are related to server availability
 */
export function isServerUnavailable(error: any): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('connection refused') || 
           message.includes('network error') ||
           message.includes('connection failed') ||
           message.includes('timeout');
  }
  return false;
}
