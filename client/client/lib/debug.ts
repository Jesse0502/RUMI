// Debug utility functions for better error logging

/**
 * Safely serialize an object for logging, handling circular references and complex objects
 */
export function safeStringify(obj: any, indent = 2): string {
  const seen = new WeakSet();
  
  try {
    return JSON.stringify(obj, (key, value) => {
      // Handle circular references
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      
      // Handle functions
      if (typeof value === 'function') {
        return `[Function: ${value.name || 'anonymous'}]`;
      }
      
      // Handle undefined
      if (value === undefined) {
        return '[undefined]';
      }
      
      // Handle DOM elements
      if (value instanceof Element) {
        return `[${value.tagName}: ${value.id || value.className || 'no id/class'}]`;
      }
      
      // Handle Error objects
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      
      return value;
    }, indent);
  } catch (error) {
    return `[Error serializing object: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}

/**
 * Enhanced console.error with better object serialization
 */
export function debugError(message: string, data?: any): void {
  if (data) {
    console.error(message, safeStringify(data));
  } else {
    console.error(message);
  }
}

/**
 * Enhanced console.log with better object serialization
 */
export function debugLog(message: string, data?: any): void {
  if (data) {
    console.log(message, safeStringify(data));
  } else {
    console.log(message);
  }
}

/**
 * Enhanced console.warn with better object serialization
 */
export function debugWarn(message: string, data?: any): void {
  if (data) {
    console.warn(message, safeStringify(data));
  } else {
    console.warn(message);
  }
}

/**
 * Extract meaningful information from WebSocket events
 */
export function getWebSocketEventInfo(event: Event) {
  const target = event.target as WebSocket;
  
  return {
    type: event.type,
    timeStamp: event.timeStamp,
    isTrusted: event.isTrusted,
    target: {
      constructor: target?.constructor?.name,
      readyState: target?.readyState,
      url: target?.url,
      protocol: target?.protocol,
      extensions: target?.extensions,
      bufferedAmount: target?.bufferedAmount
    }
  };
}

/**
 * Extract meaningful information from Error objects
 */
export function getErrorInfo(error: any) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    return safeStringify(error);
  }
  
  return error;
}

/**
 * Get browser and connection information for debugging
 */
export function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    onLine: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    platform: navigator.platform,
    timestamp: new Date().toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    url: window.location.href,
    referrer: document.referrer
  };
}

/**
 * Performance timing information for debugging
 */
export function getPerformanceInfo() {
  if ('performance' in window && performance.timing) {
    const timing = performance.timing;
    return {
      navigationStart: timing.navigationStart,
      domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
      loadEventEnd: timing.loadEventEnd,
      pageLoadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart
    };
  }
  return null;
}
