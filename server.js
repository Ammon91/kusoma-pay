import express from "express";
import dotenv from "dotenv";

import stkRoute from "./stk.js";
import confirm from "./confirmation.js";
import validate from "./validation.js";
import webhook from "./webhook.js";

dotenv.config();

const app = express();
app.use(express.json());

// Your API routes
app.post("/stkpush", stkRoute);
app.post("/payment/confirm", confirm);
app.post("/payment/validate", validate);

// 👇 This is the critical route Safaricom will POST to
app.post("/webhook", webhook);

// Server listening
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
