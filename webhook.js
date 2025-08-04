import fetch from "node-fetch";

export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: "Method Not Allowed" });
  }

  const {
    merchantRequestId,
    checkoutRequestId,
    resultCode,
    resultDesc,
    amount,
    phoneNumber,
    mpesaReceiptNumber,
    transactionDate
  } = req.body;

  try {
    const base44WebhookUrl = 'https://app--kusoma-africa-47df8661.base44.app/api/apps/6889dba68f46c9a947df8661/functions/paymentWebhook';

    const payload = {
      merchantRequestId,
      checkoutRequestId,
      resultCode,
      resultDesc,
      amount,
      phoneNumber,
      mpesaReceiptNumber,
      transactionDate
    };

    const response = await fetch(base44WebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log("📤 Webhook sent to Base44. Status:", response.status);
    console.log("📦 Webhook response body:", responseText);

    if (response.ok) {
      res.json({ forwarded: true, base44Status: response.status, base44Response: responseText });
    } else {
      res.status(response.status).json({ error: "Forwarding failed", base44Response: responseText });
    }

  } catch (error) {
    console.error("❌ Webhook forwarding error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
