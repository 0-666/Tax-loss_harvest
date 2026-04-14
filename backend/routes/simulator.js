/**
 * Greedy Tax-Loss Harvesting Algorithm
 *
 * Formula:
 * - Unrealized P/L = (Current Price − Buy Price) × Quantity
 * - Tax Savings = |Loss| × 0.20 (fixed 20% tax rate)
 * - Harvest Score = |Loss| ÷ ML Rating (lower score = better candidate)
 */

const axios = require("axios");

/**
 * Main simulation function - implements greedy algorithm
 * @param {Object} params
 * @param {number} params.targetOffset - Dollar amount to harvest
 * @param {string[]} params.lockedAssets - Tickers to exclude from harvesting
 * @param {Object[]} params.portfolio - Array of position objects
 * @returns {Promise<Object>} Simulation results
 */
async function runSimulation(params) {
  const { targetOffset, lockedAssets = [], portfolio = [] } = params;

  // Step 1: Calculate unrealized P/L for each position
  const positions = portfolio
    .map((pos) => {
      const unrealizedPL = (pos.currentPrice - pos.buyPrice) * pos.quantity;
      const taxSavings = Math.abs(unrealizedPL) * 0.2; // 20% tax rate
      const isLocked = pos.locked || lockedAssets.includes(pos.ticker);
      const isLoss = unrealizedPL < 0;

      return {
        ...pos,
        unrealizedPL: Math.round(unrealizedPL * 100) / 100,
        taxSavings: Math.round(taxSavings * 100) / 100,
        isLoss,
        isLocked,
      };
    })
    .filter((pos) => !pos.isLocked); // Remove locked assets

  // Step 2: Get ML scores for all positions with losses
  const lossPositions = positions.filter((pos) => pos.isLoss);
  const tickers = lossPositions.map((pos) => pos.ticker);

  let mlScores = {};
  try {
    const response = await axios.post("http://localhost:8000/api/ml-score", {
      tickers,
    });
    response.data.forEach((score) => {
      mlScores[score.ticker] = score.ml_score;
    });
  } catch (error) {
    console.error("ML Service error, using default scores:", error.message);
    // Fallback: use random scores 1-100
    tickers.forEach((ticker) => {
      mlScores[ticker] = Math.floor(Math.random() * 100) + 1;
    });
  }

  // Step 3: Calculate harvest score for each loss position
  const harvestCandidates = lossPositions
    .map((pos) => {
      const mlRating = mlScores[pos.ticker] || 50;
      const harvestScore =
        mlRating > 0
          ? Math.round((Math.abs(pos.unrealizedPL) / mlRating) * 100) / 100
          : Math.abs(pos.unrealizedPL);

      return {
        ...pos,
        mlRating,
        harvestScore,
      };
    })
    // Step 4: GREEDY SORT - highest harvest score first (maximum tax savings per unit of risk)
    .sort((a, b) => b.harvestScore - a.harvestScore);

  // Step 5: Greedily select assets until target is met
  let selectedAssets = [];
  let totalTaxSavings = 0;
  let remainingTarget = targetOffset;

  for (const asset of harvestCandidates) {
    if (remainingTarget <= 0) break;

    selectedAssets.push(asset);
    totalTaxSavings += asset.taxSavings;
    remainingTarget -= Math.abs(asset.unrealizedPL);
  }

  // Step 6: Calculate portfolio-level metrics
  const totalPortfolioValue = positions.reduce(
    (sum, pos) => sum + pos.currentPrice * pos.quantity,
    0
  );
  const totalUnrealizedPL = positions.reduce(
    (sum, pos) => sum + pos.unrealizedPL,
    0
  );
  const selectedValue = selectedAssets.reduce(
    (sum, pos) => sum + Math.abs(pos.unrealizedPL),
    0
  );

  return {
    success: true,
    timestamp: new Date().toISOString(),
    targetOffset: Math.round(targetOffset * 100) / 100,
    selectedAssets: selectedAssets.map((asset) => ({
      ticker: asset.ticker,
      name: asset.name,
      quantity: asset.quantity,
      buyPrice: Math.round(asset.buyPrice * 100) / 100,
      currentPrice: Math.round(asset.currentPrice * 100) / 100,
      unrealizedPL: asset.unrealizedPL,
      taxSavings: asset.taxSavings,
      mlRating: asset.mlRating,
      harvestScore: asset.harvestScore,
    })),
    metrics: {
      assetsHarvested: selectedAssets.length,
      totalHarvestedValue: Math.round(selectedValue * 100) / 100,
      totalTaxSavings: Math.round(totalTaxSavings * 100) / 100,
      netPortfolioGain: Math.round(totalUnrealizedPL * 100) / 100,
      portfolioValue: Math.round(totalPortfolioValue * 100) / 100,
      targetOffset: Math.round(targetOffset * 100) / 100,
      offsetMet:
        remainingTarget <= 0
          ? "Full offset achieved"
          : `$${Math.round(Math.abs(remainingTarget) * 100) / 100} remaining`,
    },
  };
}

module.exports = { runSimulation };
