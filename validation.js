export default function validate(req, res) {
  console.log("Validation received:", req.body);
  res.status(200).json({ ResultCode: 0, ResultDesc: "Validation accepted" });
}
