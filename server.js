import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Start OpenClaw internally
exec("npx openclaw gateway --host 0.0.0.0 --port 18789");

// Proxy OpenClaw UI to main URL
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:18789",
    changeOrigin: true
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
