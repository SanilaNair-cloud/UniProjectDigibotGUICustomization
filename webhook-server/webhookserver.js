

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post("/webhook", (req, res) => {
  const { message, tone, custom_audience } = req.body;

  console.log("✅ Webhook received:");
  console.log("🔹 Message:", message);
  if (tone) console.log("🔸 Tone of Voice:", tone);
  if (custom_audience) console.log("🔸 Custom Audience:", custom_audience);

  // Respond with mock message
  const responseText = `🟢 Your query: "${message}"
  
⚠️ This is a test response. The production webhook is not yet active.
  
🎯 Audience: ${custom_audience || "Not specified"}  
🗣️ Tone: ${tone || "Not specified"}
  
✅ Once the real webhook is ready, this will return intelligent AI-generated responses.`;

  res.json({ reply: responseText });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Webhook Server running at http://localhost:${PORT}`);
});