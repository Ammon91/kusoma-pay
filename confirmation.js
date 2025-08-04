import dotenv from "dotenv";
import base44 from "@base44/sdk";
dotenv.config();

// ✅ Initialize Base44 client
base44.init({
  appId: process.env.BASE44_APP_ID,
  apiKey: process.env.BASE44_SERVICE_ROLE_KEY,
});

export default async function confirmationHandler(req, res) {
  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      return res.status(400).json({ message: "Invalid callback format" });
    }

    const payload = {
      checkoutRequestId: callbackData.CheckoutRequestID,
      resultCode: callbackData.ResultCode,
      resultDesc: callbackData.ResultDesc,
      mpesaReceiptNumber:
        callbackData.CallbackMetadata?.Item?.find((i) => i.Name === "MpesaReceiptNumber")?.Value || "",
    };

    console.log("📥 M-Pesa Confirmation:", payload);

    // 🔍 Lookup order in Base44 using checkoutRequestId
    const orders = await base44.entities.Order.filter({
      checkout_request_id: payload.checkoutRequestId,
    });

    if (!orders.length) {
      console.error("❌ No matching order found in Base44.");
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];
    console.log("🔍 Verifying payment for order:", order.id);

    // ✅ Update based on resultCode
    if (payload.resultCode === 0 || payload.resultCode === "0") {
      await base44.entities.Order.update(order.id, {
        payment_status: "paid",
        payment_reference: payload.mpesaReceiptNumber,
        mpesa_receipt_number: payload.mpesaReceiptNumber,
      });
      console.log("✅ Order marked as PAID in Base44");
    } else {
      await base44.entities.Order.update(order.id, {
        payment_status: "failed",
        failure_reason: payload.resultDesc || "Payment failed",
      });
      console.log("❌ Order marked as FAILED in Base44");
    }

    return res.status(200).json({ message: "Confirmation processed & Base44 notified" });
  } catch (error) {
    console.error("❌ Error in confirmation handler:", error.message);
    return res.status(500).json({ error: "Internal error", message: error.message });
  }
}
