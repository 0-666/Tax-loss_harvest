const mongoose = require("mongoose");

const portfolioPositionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticker: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    buyPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

portfolioPositionSchema.index({ user: 1, ticker: 1 }, { unique: true });

module.exports = mongoose.model("PortfolioPosition", portfolioPositionSchema);
