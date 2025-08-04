export default function confirm(req, res) {
  console.log("Payment Confirmed:", req.body);
  res.status(200).json({ ResultCode: 0, ResultDesc: "Confirmation received successfully" });
}
