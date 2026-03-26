import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Start OpenCLAW in background
exec("npx openclaw gateway --host 0.0.0.0 --port 18789");

// Health endpoint (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("OpenClaw is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
