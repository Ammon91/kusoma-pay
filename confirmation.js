// confirmation.js

export default async function confirmationHandler(req, res) {
  try {
    const callbackData = req.body;

    console.log("✅ Payment Confirmed (from Safaricom):", JSON.stringify(callbackData, null, 2));

    // Forward the confirmation to Kusoma Africa Base44 webhook
    const webhookUrl = "https://preview--kusoma-africa-47df8661.base44.app/functions/paymentWebhook";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(callbackData)
    });

    if (!response.ok) {
      console.error(`❌ Forwarding failed with status ${response.status}`);
      return res.status(500).json({ message: "Forwarding to Kusoma Africa failed." });
    }

    console.log("✅ Successfully forwarded to Kusoma Africa webhook.");

    return res.status(200).json({ message: "Confirmation received and forwarded." });

  } catch (error) {
    console.error("❌ Error in confirmation handler:", error.message);
    return res.status(500).json({ message: "Internal server error in confirmation." });
  }
}
