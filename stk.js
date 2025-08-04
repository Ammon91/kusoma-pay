import axios from "axios";
import { getAccessToken } from "./utils/mpesa.js";
import dotenv from "dotenv";
dotenv.config();

export default async function stkPush(req, res) {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount are required" });
    }

    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString("base64");

    const response = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE, // 5498852 (used to generate password)
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline", // works for Tills and Paybills
        Amount: amount,
        PartyA: phone,                          // Customer
        PartyB: process.env.MPESA_PARTYB,       // Recipient → 280289 (Till)
        PhoneNumber: phone,                     // Customer
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: process.env.MPESA_ACCOUNT_REFERENCE,
        TransactionDesc: process.env.MPESA_TRANSACTION_DESC
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
}
