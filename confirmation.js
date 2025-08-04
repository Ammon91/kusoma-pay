// confirmation.js

export default async function confirmationHandler(req, res) {
  try {
    const callbackData = req.body?.Body?.stkCallback;

    if (!callbackData) {
      return res.status(400).json({ message: "Invalid callback data format" });
    }

    console.log("✅ Payment Confirmed (from Safaricom):", JSON.stringify(callbackData, null, 2));

    // Prepare payload for Kusoma Africa
    const payload = {
      merchantRequestId: callbackData.MerchantRequestID,
      checkoutRequestId: callbackData.CheckoutRequestID,
      resultCode: callbackData.ResultCode,
      resultDesc: callbackData.ResultDesc,
      amount: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "Amount")?.Value || 0,
      phoneNumber: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "PhoneNumber")?.Value || "",
      mpesaReceiptNumber: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "MpesaReceiptNumber")?.Value || "",
      transactionDate: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "TransactionDate")?.Value || "",
    };

    console.log("📤 Forwarding to Kusoma Africa:", payload);

    // ✅ Correct Base44 webhook URL (POST endpoint)
    const response = await fetch("https://app--kusoma-africa-47df8661.base44.app/api/apps/6889dba68f46c9a947df8661/functions/paymentWebhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Webhook forwarding failed:", error);
      return res.status(500).json({ message: "Forwarding failed", error });
    }

    console.log("✅ Successfully forwarded to Kusoma Africa.");
    return res.status(200).json({ message: "Confirmation received and forwarded." });
  } catch (error) {
    console.error("❌ Error in confirmation handler:", error.message);
    return res.status(500).json({ message: "Internal server error in confirmation." });
  }
}
