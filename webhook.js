// webhook.js
import dotenv from "dotenv";
import express from "express";
import axios from "axios";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const callbackData = req.body;

    // 🔁 Forward POST data to your Base44 function
    const base44Url = process.env.BASE44_WEBHOOK_URL || "https://yourapp.base44.app/functions/paymentWebhook";

    console.log("🔁 Forwarding webhook to Base44:", base44Url);
    const response = await axios.post(base44Url, callbackData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Forwarded to Base44:", response.status);
    res.status(200).send("Webhook forwarded successfully");
  } catch (error) {
    console.error("❌ Error forwarding webhook:", error.message);
    res.status(500).send("Failed to forward webhook");
  }
});

export default router;
