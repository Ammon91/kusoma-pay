import express from "express";
import dotenv from "dotenv";

import stkRoute from "./stk.js";
import confirm from "./confirmation.js";
import validate from "./validation.js";
import webhook from "./webhook.js"; // ✅ Webhook forwarder to Base44

dotenv.config();

const app = express();
app.use(express.json());

// Your endpoints
app.post("/stkpush", stkRoute);                    // STK Push trigger
app.post("/payment/confirm", confirm);             // M-Pesa confirmation callback
app.post("/payment/validate", validate);           // M-Pesa validation callback
app.post("/webhook", webhook);                     // Forwards webhook to Base44

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("✅ Kusoma Pay backend is running!");
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
