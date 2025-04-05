const express = require("express");
const mongoose = require("mongoose");
const axios = require('axios');
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const tripRoutes = require('./routes/tripRoutes');
const submissionRoutes = require('./routes/submissionRoutes');


const app = express();
app.use(express.json());

// ✅ CORS Setup
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


  
// ✅ API Routes
app.use("/", authRoutes);

app.get("/sample", (req, res) => {
  res.send({ message: "msg" });
});

app.use('/api/trip', tripRoutes);

app.use('/api', submissionRoutes);

const placesRoutes = require('./routes/placesRoutes');
app.use('/api', placesRoutes);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: userMessage }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: botReply || "No reply generated." });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Gemini API failed",
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));