// Notification utility functions for RUMI app

export interface NotificationOptions {
  title: string;
  body: string;
  data?: {
    url?: string;
    type?: string;
    messageId?: string;
    userId?: string;
  };
  icon?: string;
  badge?: string;
  tag?: string;
}

// Send a push notification to all subscribers
export async function sendPushNotification(options: NotificationOptions) {
  try {
    const response = await fetch("/api/send-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: options.title,
        body: options.body,
        data: options.data || {},
        icon: options.icon || "/placeholder.svg",
        badge: options.badge || "/placeholder.svg",
        tag: options.tag,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}

// Send notification for new inbox message
export function notifyNewMessage(from: string, subject: string, messageId?: string) {
  return sendPushNotification({
    title: `New message from ${from}`,
    body: subject,
    data: {
      url: "/inbox",
      type: "new_message",
      messageId,
    },
    tag: "new_message",
  });
}

// Send notification for connection request
export function notifyConnectionRequest(from: string, userId?: string) {
  return sendPushNotification({
    title: "New Connection Request",
    body: `${from} wants to connect with you`,
    data: {
      url: "/connections",
      type: "connection_request",
      userId,
    },
    tag: "connection_request",
  });
}

// Send notification for connection accepted
export function notifyConnectionAccepted(from: string, userId?: string) {
  return sendPushNotification({
    title: "Connection Accepted! 🎉",
    body: `${from} accepted your connection request`,
    data: {
      url: "/chat",
      type: "connection_accepted",
      userId,
    },
    tag: "connection_accepted",
  });
}

// Send notification for AI match found
export function notifyAIMatch(matchName: string, reason: string) {
  return sendPushNotification({
    title: "New AI Match Found! ✨",
    body: `${matchName} - ${reason}`,
    data: {
      url: "/feed",
      type: "ai_match",
    },
    tag: "ai_match",
  });
}

// Send notification for event reminder
export function notifyEventReminder(eventName: string, timeUntil: string) {
  return sendPushNotification({
    title: "Event Reminder 📅",
    body: `${eventName} starts in ${timeUntil}`,
    data: {
      url: "/events",
      type: "event_reminder",
    },
    tag: "event_reminder",
  });
}

// Check if notifications are supported and enabled
export function checkNotificationSupport() {
  return {
    supported: 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window,
    permission: 'Notification' in window ? Notification.permission : 'unsupported',
  };
}

// Show browser notification (fallback for when push notifications aren't available)
export function showBrowserNotification(options: NotificationOptions) {
  if (!('Notification' in window)) {
    console.warn('Browser notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  return new Notification(options.title, {
    body: options.body,
    icon: options.icon || "/placeholder.svg",
    badge: options.badge || "/placeholder.svg",
    tag: options.tag,
    data: options.data,
  });
}
