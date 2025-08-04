// stkPush.js
import axios from "axios";
import { getAccessToken } from "./utils/mpesa.js";
import dotenv from "dotenv";
dotenv.config();

export default async function stkPush(req, res) {
  try {
    const { phone, amount, orderId } = req.body;

    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline", // ✅ For Till Number
      Amount: amount,
      PartyA: phone,
      PartyB: "280289", // ✅ Your Buy Goods Till Number
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: orderId || "KusomaOrder",
      TransactionDesc: `Payment for order ${orderId || "KusomaOrder"}`
    };

    const response = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate STK Push" });
  }
}
