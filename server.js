import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

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

// Optional proxy (not needed for Telegram but safe)
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
