// confirmation.js - Updated to handle M-Pesa STK callback format

export default async function confirmationHandler(req, res) {
  try {
    const callbackData = req.body;
    
    console.log("✅ Payment Confirmed (from Safaricom):", JSON.stringify(callbackData, null, 2));

    // Extract data from M-Pesa STK callback format
    const stkCallback = callbackData.Body?.stkCallback;
    if (!stkCallback) {
      console.log("⚠️ No stkCallback found in request body");
      return res.status(200).json({
        ResultCode: "0",
        ResultDesc: "Confirmation received"
      });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback;

    // Extract metadata items
    let mpesaReceiptNumber, amount, phoneNumber, transactionDate;
    if (CallbackMetadata?.Item) {
      CallbackMetadata.Item.forEach(item => {
        switch (item.Name) {
          case 'MpesaReceiptNumber':
            mpesaReceiptNumber = item.Value;
            break;
          case 'Amount':
            amount = item.Value;
            break;
          case 'PhoneNumber':
            phoneNumber = item.Value;
            break;
          case 'TransactionDate':
            transactionDate = item.Value;
            break;
        }
      });
    }

    // Prepare webhook payload for Kusoma Africa
    const webhookPayload = {
      ResultCode: ResultCode,
      ResultDesc: ResultDesc,
      MpesaReceiptNumber: mpesaReceiptNumber,
      TransactionDate: transactionDate,
      PhoneNumber: phoneNumber,
      Amount: amount,
      CheckoutRequestID: CheckoutRequestID,
      MerchantRequestID: MerchantRequestID
    };

    // Forward to Kusoma Africa Base44 webhook
    const webhookUrl = "https://base44.app/api/apps/6889dba68f46c9a947df8661/functions/paymentWebhook";
    
    console.log("📤 Forwarding to Kusoma Africa:", webhookUrl);
    console.log("📦 Payload:", JSON.stringify(webhookPayload, null, 2));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Kusoma-Pay-Webhook/1.0"
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Webhook forwarding failed:`, {
        status: response.status,
        statusText: response.statusText,
        response: errorText
      });
    } else {
      const responseData = await response.json();
      console.log("✅ Successfully forwarded to Kusoma Africa:", responseData);
    }

    // Always respond success to Safaricom
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
