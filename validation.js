// validation.js - M-Pesa validation handler

export default async function validationHandler(req, res) {
  try {
    const validationData = req.body;
    
    console.log("🔍 Payment Validation Request:", JSON.stringify(validationData, null, 2));

    const {
      TransType,
      TransID,
      TransTime,
      TransAmount,
      BusinessShortCode,
      BillRefNumber,
      InvoiceNumber,
      OrgAccountBalance,
      ThirdPartyTransID,
      MSISDN,
      FirstName,
      MiddleName,
      LastName
    } = validationData;

    // Basic validation logic
    if (!TransAmount || TransAmount <= 0) {
      console.log("❌ Validation failed: Invalid amount");
      return res.status(200).json({
        ResultCode: "C2000003",
        ResultDesc: "The service request is rejected - Invalid Amount."
      });
    }

    if (!MSISDN) {
      console.log("❌ Validation failed: Invalid phone number");
      return res.status(200).json({
        ResultCode: "C2000004",
        ResultDesc: "The service request is rejected - Invalid Phone Number."
      });
    }

    // Add your custom validation logic here
    // For example: check if BillRefNumber exists in your database
    
    console.log("✅ Validation passed for transaction:", TransID);
    
    // Accept the transaction
    return res.status(200).json({
      ResultCode: "0",
      ResultDesc: "Accepted"
    });

  } catch (error) {
    console.error("❌ Error in validation handler:", error);
    
    // Reject on error
    return res.status(200).json({
      ResultCode: "C2000011",
      ResultDesc: "The service request is rejected - System Error."
    });
  }
}
