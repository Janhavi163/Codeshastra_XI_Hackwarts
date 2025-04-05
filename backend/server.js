const express = require("express");
const mongoose = require("mongoose");
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


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));