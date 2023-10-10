const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const PORT = 3001;

app.use(bodyParser.json());

// Simulated payment webhook
app.use(express.static('uploads'))

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
