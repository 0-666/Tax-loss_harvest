const fs = require("fs");
const path = require("path");
const axios = require("axios");
const PortfolioPosition = require("../model/portfolioModel");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const loadMockPortfolio = () => {
  const mockPath = path.join(__dirname, "..", "mock_portfolio.json");
  const raw = fs.readFileSync(mockPath, "utf-8");
  const mockData = JSON.parse(raw);
  return mockData.portfolio || [];
};

const fetchStockPrices = async (tickers) => {
  if (!tickers || tickers.length === 0) return {};

  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/stock-data`,
      { tickers },
      { timeout: 15000 }
    );

    return response.data.reduce((map, item) => {
      map[item.ticker.toUpperCase()] = item;
      return map;
    }, {});
  } catch (error) {
    console.error("Stock-data service error:", error.message);
    return {};
  }
};

const seedPortfolioForUser = async (userId) => {
  const existing = await PortfolioPosition.findOne({ user: userId });
  if (existing) {
    return await PortfolioPosition.find({ user: userId }).lean();
  }

  const mockPortfolio = loadMockPortfolio();
  const payload = mockPortfolio.map((pos) => ({
    user: userId,
    ticker: pos.ticker,
    name: pos.name,
    quantity: pos.quantity,
    buyPrice: pos.buyPrice,
    currentPrice: pos.currentPrice,
    locked: pos.locked || false,
  }));

  await PortfolioPosition.insertMany(payload);
  return await PortfolioPosition.find({ user: userId }).lean();
};

const refreshPortfolioPrices = async (positions) => {
  if (!positions || positions.length === 0) return positions;

  const tickers = positions.map((position) => position.ticker.toUpperCase());
  const quotes = await fetchStockPrices([...new Set(tickers)]);

  return Promise.all(
    positions.map(async (position) => {
      const quote = quotes[position.ticker.toUpperCase()];
      if (quote && quote.currentPrice != null) {
        const currentPrice = Number(quote.currentPrice.toFixed(2));
        if (position.currentPrice !== currentPrice) {
          await PortfolioPosition.updateOne(
            { _id: position._id },
            { currentPrice }
          );
        }
        return { ...position, currentPrice };
      }
      return position;
    })
  );
};

exports.getPortfolio = async (req, res) => {
  try {
    const positions = await seedPortfolioForUser(req.user);
    const refreshed = await refreshPortfolioPrices(positions);
    res.json({ portfolio: refreshed });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    res.status(500).json({ error: "Unable to load portfolio data" });
  }
};

exports.addPosition = async (req, res) => {
  try {
    const { ticker, quantity, buyPrice } = req.body;
    const upperTicker = String(ticker || "").trim().toUpperCase();

    if (!upperTicker || !quantity || !buyPrice) {
      return res.status(400).json({ error: "ticker, quantity and buyPrice are required" });
    }

    if (quantity <= 0 || buyPrice <= 0) {
      return res.status(400).json({ error: "quantity and buyPrice must be greater than zero" });
    }

    const quotes = await fetchStockPrices([upperTicker]);
    const quote = quotes[upperTicker];

    if (!quote || quote.currentPrice == null) {
      return res.status(400).json({ error: "Unable to fetch live quote for ticker" });
    }

    const position = await PortfolioPosition.findOneAndUpdate(
      { user: req.user, ticker: upperTicker },
      {
        user: req.user,
        ticker: upperTicker,
        name: quote.name || upperTicker,
        quantity,
        buyPrice,
        currentPrice: Number(quote.currentPrice.toFixed(2)),
        locked: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ success: true, position });
  } catch (error) {
    console.error("Add position error:", error);
    res.status(500).json({ error: "Unable to add portfolio position" });
  }
};

exports.updatePositionLock = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { locked } = req.body;

    if (typeof locked !== "boolean") {
      return res.status(400).json({ error: "locked must be a boolean" });
    }

    const position = await PortfolioPosition.findOneAndUpdate(
      { user: req.user, ticker },
      { locked },
      { new: true }
    ).lean();

    if (!position) {
      return res.status(404).json({ error: "Position not found" });
    }

    res.json({ success: true, position });
  } catch (error) {
    console.error("Update lock error:", error);
    res.status(500).json({ error: "Unable to update position lock" });
  }
};

exports.getUserPositions = async (userId) => {
  return PortfolioPosition.find({ user: userId }).lean();
};
