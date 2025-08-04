import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function confirmationHandler(req, res) {
  try {
    const callbackData = req.body?.Body?.stkCallback;

    if (!callbackData) {
      return res.status(400).json({ message: "Invalid Safaricom callback format" });
    }

    const payload = {
      checkoutRequestId: callbackData.CheckoutRequestID,
      resultCode: callbackData.ResultCode,
      resultDesc: callbackData.ResultDesc,
      mpesaReceiptNumber: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "MpesaReceiptNumber")?.Value || "",
      amount: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "Amount")?.Value || 0,
      phoneNumber: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "PhoneNumber")?.Value || "",
      transactionDate: callbackData.CallbackMetadata?.Item?.find(i => i.Name === "TransactionDate")?.Value || ""
    };

    console.log("📤 Safaricom Payment Data Received:", payload);

    // Send to Base44
    const base44Response = await fetch(`${process.env.BASE44_FUNCTION_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BASE44_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await base44Response.json();

    if (!base44Response.ok) {
      console.error("❌ Failed to notify Base44:", result);
      return res.status(500).json({ message: "Notification to Base44 failed", details: result });
    }

    console.log("✅ Successfully notified Base44:", result);
    return res.status(200).json({ message: "Payment received and forwarded to Base44" });

  } catch (error) {
    console.error("❌ Error processing payment:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
