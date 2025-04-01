// webhook-server/server.js

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;


app.use(cors());
app.use(express.json());

app.post("/webhook", (req, res) => {
  const { message } = req.body;
  console.log("✅ Webhook received:", message);


  const responseText = `Digibot Reposnse "${message}". Here's a mock reply from the webhook server.`;

  res.json({ reply: responseText });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock webhook server running at http://localhost:${PORT}`);
});
