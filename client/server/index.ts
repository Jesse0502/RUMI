import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import webpush from "web-push";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Setup VAPID keys from env or generate
  let publicVapid = process.env.VAPID_PUBLIC_KEY || "";
  let privateVapid = process.env.VAPID_PRIVATE_KEY || "";

  if (!publicVapid || !privateVapid) {
    const keys = webpush.generateVAPIDKeys();
    publicVapid = keys.publicKey;
    privateVapid = keys.privateKey;
    console.warn(
      "Generated VAPID keys for web-push. For production, set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in environment.",
    );
  }

  webpush.setVapidDetails("mailto:admin@rumi.app", publicVapid, privateVapid);

  // In-memory subscription store (for demo)
  const subscriptions: any[] = [];

  // Expose public vapid key
  app.get("/api/vapid", (_req, res) => {
    res.json({ publicKey: publicVapid });
  });

  // Subscribe endpoint
  app.post("/api/subscribe", (req, res) => {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription" });
    }
    subscriptions.push(subscription);
    console.log("New subscription received. Total:", subscriptions.length);
    res.json({ success: true });
  });

  // Send push to all subscribers
  app.post("/api/send-push", async (req, res) => {
    const {
      title = "RUMI",
      body = "You have a new notification",
      data = {},
    } = req.body || {};

    const payload = JSON.stringify({ title, body, data });

    // Send to all subscriptions (best-effort)
    const results: any[] = [];
    await Promise.all(
      subscriptions.map(async (sub, idx) => {
        try {
          await webpush.sendNotification(sub, payload);
          results.push({ idx, ok: true });
        } catch (err: any) {
          console.warn(
            "Failed to send push to subscriber",
            idx,
            err?.message || err,
          );
          results.push({ idx, ok: false, error: err?.message });
        }
      }),
    );

    res.json({ sent: results.length, results });
  });

  // Dummy upload endpoint
  app.post("/api/upload", (req, res) => {
    // In a real app, you'd save files to storage. For now return a dummy URL.
    console.log("Upload request (dummy)", req.body?.filename || "no-filename");
    res.json({ ok: true, url: "/uploads/dummy.jpg" });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
