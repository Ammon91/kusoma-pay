import express from "express";
import fetch from "node-fetch"; // Ensure node-fetch is installed

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await fetch("https://kusoma-africa-47df8661.base44.app/functions/paymentWebhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const result = await response.text();
    console.log("✅ Webhook forwarded. Base44 responded with:", result);
    res.status(200).send("Forwarded to Base44");
  } catch (error) {
    console.error("❌ Webhook forwarding failed:", error);
    res.status(500).send("Error forwarding webhook");
  }
});

export default router;
