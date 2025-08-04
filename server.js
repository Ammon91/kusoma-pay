import express from "express";
import dotenv from "dotenv";
import stkRoute from "./stk.js";
import confirm from "./confirmation.js";
import validate from "./validation.js";
import webhook from "./webhook.js";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/stkpush", stkRoute);
app.post("/payment/confirm", confirm);
app.post("/payment/validate", validate);
app.post("/webhook", webhook); // ✅ Webhook route

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
