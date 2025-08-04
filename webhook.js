export default async (req, res) => {
  try {
    console.log("📥 Incoming M-Pesa webhook:", req.body);
    
    // Optional: Forward to Base44 (if needed)
    // const response = await fetch("https://kusoma-africa-47df8661.base44.app/functions/paymentWebhook", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(req.body),
    // });
    // const result = await response.text();
    // console.log("✅ Forwarded to Base44:", result);

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    res.status(500).send("Error processing webhook");
  }
};
