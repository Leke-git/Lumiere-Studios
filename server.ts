import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // The dynamic path for the admin panel from environment variable
  const adminPath = process.env.ADMIN_PATH || "/admin";

  // API endpoint to serve public configuration to the frontend
  app.get("/api/config", (req, res) => {
    const webhook = process.env.N8N_WEBHOOK || process.env.N8N_WEBHOOK_URL || "";
    const secret = process.env.WEBHOOK_SECRET || "";
    
    console.log(`Config requested. Webhook found: ${!!webhook}, Secret found: ${!!secret}`);
    
    res.json({
      n8nWebhook: webhook,
      webhookSecret: secret
    });
  });

  // Serve the admin page at the dynamic path
  // We use a specific route to serve the admin-panel.html file
  app.get(adminPath, (req, res) => {
    res.sendFile(path.join(__dirname, "admin-panel.html"));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production setup
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel configured at: ${adminPath}`);
  });
}

startServer();
