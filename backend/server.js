const express = require("express");
const cors = require("cors");
const path = require("path");
require("colors");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const portfolioRoutes = require("./routes/portfolioRoute");
const authMiddleware = require("./middleware/authMiddleware");
const { runSimulation } = require("./routes/simulator");
const { getUserPositions } = require("./controller/portfolioController");
const fs = require("fs");

const app = express();

// 🔥 Connect DB
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// 📊 Tax-Loss Harvesting Simulator Endpoint
app.post("/api/simulate", authMiddleware, async (req, res) => {
  try {
    const { targetOffset, lockedAssets, portfolio } = req.body;

    // Use provided portfolio or fallback to user portfolio from the database
    let portfolioData = portfolio;
    if (!portfolioData || portfolioData.length === 0) {
      const userPortfolio = await getUserPositions(req.user);
      portfolioData = userPortfolio.map((position) => ({
        ticker: position.ticker,
        name: position.name,
        quantity: position.quantity,
        buyPrice: position.buyPrice,
        currentPrice: position.currentPrice,
        locked: position.locked,
      }));
    }

    // Validate inputs
    if (!targetOffset || targetOffset <= 0) {
      return res.status(400).json({ error: "Invalid targetOffset" });
    }

    if (portfolioData.length > 200) {
      return res.status(400).json({ error: "Portfolio exceeds 200 positions limit" });
    }

    // Run the simulation
    const results = await runSimulation({
      targetOffset,
      lockedAssets: lockedAssets || [],
      portfolio: portfolioData,
    });

    res.json(results);
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgBlue.white.bold);
});