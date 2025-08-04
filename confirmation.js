// confirmation.js - Complete webhook handler for M-Pesa confirmations

export default async function confirmationHandler(req, res) {
  try {
    const callbackData = req.body;
    
    console.log("✅ Payment Confirmed (from Safaricom):", JSON.stringify(callbackData, null, 2));

    // Extract M-Pesa confirmation data
    const {
      TransID,
      TransTime,
      TransAmount,
      BusinessShortCode,
      BillRefNumber,
      InvoiceNumber,
      OrgAccountBalance,
      ThirdPartyTransID,
      MSISDN,
      FirstName,
      MiddleName,
      LastName
    } = callbackData;

    // Prepare webhook payload for Kusoma Africa
    const webhookPayload = {
      ResultCode: "0", // Success
      ResultDesc: "The service request is processed successfully.",
      MpesaReceiptNumber: TransID,
      TransactionDate: TransTime,
      PhoneNumber: MSISDN,
      Amount: TransAmount,
      CheckoutRequestID: BillRefNumber, // This should match the order ID
      // Additional data
      CustomerName: `${FirstName || ''} ${MiddleName || ''} ${LastName || ''}`.trim(),
      AccountReference: BillRefNumber,
      TransactionDesc: `Payment for order ${BillRefNumber}`
    };

    // Forward to Kusoma Africa Base44 webhook
    const webhookUrl = "https://preview--kusoma-africa-47df8661.base44.app/functions/paymentWebhook";
    
    console.log("📤 Forwarding to Kusoma Africa:", webhookUrl);
    console.log("📦 Payload:", JSON.stringify(webhookPayload, null, 2));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Kusoma-Pay-Webhook/1.0"
      },
      body: JSON.stringify(webhookPayload),
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Webhook forwarding failed:`, {
        status: response.status,
        statusText: response.statusText,
        response: errorText
      });
      
      // Still return success to Safaricom to avoid retries
      return res.status(200).json({ 
        ResultCode: "0",
        ResultDesc: "Confirmation received (forwarding failed but logged)" 
      });
    }

    const responseData = await response.json();
    console.log("✅ Successfully forwarded to Kusoma Africa:", responseData);

    // Respond to Safaricom
    return res.status(200).json({
      ResultCode: "0",
      ResultDesc: "The service request is processed successfully."
    });

  } catch (error) {
    console.error("❌ Error in confirmation handler:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    // Always return success to Safaricom to avoid infinite retries
    return res.status(200).json({
      ResultCode: "0",
      ResultDesc: "Confirmation received and logged"
    });
  }
}
