import express from "express";
import dotenv from "dotenv";
import webhook from "./webhook.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Webhook route that Safaricom will hit
app.post("/webhook", webhook);

app.get("/", (req, res) => {
  res.send("Kusoma Pay API is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
