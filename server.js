import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Start OpenClaw properly
const openclaw = spawn("npx", [
  "openclaw",
  "gateway",
  "--host",
  "0.0.0.0",
  "--port",
  "18789"
]);

openclaw.stdout.on("data", (data) => {
  console.log(`OpenClaw: ${data}`);
});

openclaw.stderr.on("data", (data) => {
  console.error(`OpenClaw Error: ${data}`);
});

openclaw.on("close", (code) => {
  console.log(`OpenClaw exited with code ${code}`);
});

// Wait until OpenClaw starts
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
