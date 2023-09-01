const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const crypto = require("crypto");
const https = require("https");
const PORT = 9001;


function base64(payload) {
  const payloadBase64 = Buffer.from(payload).toString("base64");
  return payloadBase64;
}

function generateXVerifyHeader(payload, saltKey, saltIndex) {
  const payloadBase64 = base64(payload);

  const hashInput = payloadBase64 + "/pg/v1/pay" + saltKey;
  const hash = crypto.createHash("sha256").update(hashInput).digest("hex");

  return hash + "###" + saltIndex;
}

app.use(bodyParser.json());

// Simulated payment webhook
app.post("/webhook", (req, res) => {
  console.log("=========================");
  console.log("Webhook called");
  console.log("=========================");
  res.status(200).send("Webhook received");
});

// Payment initiation API endpoint
app.post("/initiate-payment", async (req, res) => {
  const paymentPayload = JSON.stringify({
    merchantId: "MERCHANTUAT",
    merchantTransactionId: "MT7850590068188104",
    merchantUserId: "MUID123",
    amount: 10000,
    redirectUrl: "https://webhook.site/redirect-url",
    redirectMode: "POST",
    callbackUrl: "https://test-dev-99.azurewebsites.net/webhook",
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  });

  try {
    const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const saltIndex = 1;

    const xVerifyHeader = generateXVerifyHeader(paymentPayload, saltKey, saltIndex);
    console.log("x-verify header:", xVerifyHeader);
    console.log("-base 64", base64(paymentPayload))

    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      {
        "request": base64(paymentPayload)
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyHeader,
        },
      }
    );

    console.log("Payment initiation response:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Error initiating payment" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
