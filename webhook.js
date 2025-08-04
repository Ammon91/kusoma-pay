// webhook.js
import express from "express";
import fetch from "node-fetch"; // Ensure this is installed: npm install node-fetch

const router = express.Router();

// M-Pesa sends a POST request to this route
router.post("/", async (req, res) => {
  const base44WebhookUrl = "https://kusoma-africa-47df8661.base44.app/functions/paymentWebhook";

  try {
    console.log("📡 Incoming M-Pesa webhook received, forwarding to Base44...");

    const response = await fetch(base44WebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const responseText = await response.text();

    console.log("✅ Webhook successfully forwarded to Base44.");
    console.log("📥 Base44 response:", responseText);

    res.status(200).send("Webhook forwarded to Base44");
  } catch (error) {
    console.error("❌ Webhook forwarding failed:", error.message);
    res.status(500).send("Failed to forward webhook");
  }
});

export default router;
