// server.js
import express from "express";
import bodyParser from "body-parser";
import webhook from "./webhook.js"; // Make sure this path is correct

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // To parse JSON bodies
app.use("/webhook", webhook); // M-Pesa callback will hit this

app.get("/", (req, res) => {
  res.send("Kusoma Pay backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
