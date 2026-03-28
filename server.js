import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn, exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Start OpenClaw
const openclaw = spawn("npx", [
  "openclaw",
  "gateway",
  "--port",
  "18789",
  "--allow-unconfigured"
]);

openclaw.stdout.on("data", (data) => {
  console.log(`OpenClaw: ${data}`);
});

openclaw.stderr.on("data", (data) => {
  console.error(`OpenClaw Error: ${data}`);
});

// 🔹 Connect Telegram bot AFTER slight delay
setTimeout(() => {
  console.log("Connecting Telegram bot...");

  exec("npx openclaw pairing approve telegram Hellojavisbot", (err, stdout, stderr) => {
    if (err) {
      console.error("Telegram pairing error:", err);
      return;
    }
    console.log("Telegram pairing:", stdout);
  });
}, 12000);

// 🔹 Proxy (optional, keep for health/UI)
setTimeout(() => {
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://127.0.0.1:18789",
      changeOrigin: true
    })
  );

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}, 8000);
