import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

const openclaw = spawn("bash", [
  "-c",
  `
  rm -rf /root/.openclaw && 
  export OPENCLAW_MODEL=google/gemini-1.5-flash &&
  export OPENCLAW_PROVIDER=google &&
  export GOOGLE_API_KEY=$GOOGLE_API_KEY &&
  npx openclaw gateway --port 18789 --allow-unconfigured
  `
]);

openclaw.stdout.on("data", (data) => {
  console.log(`OpenClaw: ${data}`);
});

openclaw.stderr.on("data", (data) => {
  console.error(`OpenClaw Error: ${data}`);
});

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
