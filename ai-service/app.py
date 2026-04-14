from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import yfinance as yf
from fastapi.middleware.cors import CORSMiddleware
from yahooquery import search

app = FastAPI(title="Tax-Loss Harvesting ML Service", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MLScoreRequest(BaseModel):
    tickers: List[str]

class MLScoreResponse(BaseModel):
    ticker: str
    ml_score: int
    rsi: float
    macd: float

class StockDataRequest(BaseModel):
    tickers: List[str]

class StockDataResponse(BaseModel):
    ticker: str
    currentPrice: float
    previousClose: float
    name: Optional[str] = None

class StockSearchRequest(BaseModel):
    query: str

class StockSearchResult(BaseModel):
    symbol: str
    name: str
    type: str

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "ml-scorer"}

@app.post("/api/ml-score", response_model=List[MLScoreResponse])
def get_ml_scores(request: MLScoreRequest):
    """
    Mock ML scoring endpoint that simulates XGBoost/Random Forest predictions.
    Returns RSI, MACD-based "ML Performance Rating" (1-100) for each ticker.
    """
    if not request.tickers:
        raise HTTPException(status_code=400, detail="Tickers list cannot be empty")
    
    results = []
    
    for ticker in request.tickers:
        # Simulate RSI (Relative Strength Index) - typically 0-100
        rsi = round(random.uniform(30, 70), 2)
        
        # Simulate MACD (Moving Average Convergence Divergence)
        macd = round(random.uniform(-5, 5), 2)
        
        # ML score combines RSI and MACD with some randomness to simulate model output
        # Higher RSI + positive MACD = lower ML score (higher risk)
        # Lower RSI + negative MACD = higher ML score (better harvest candidate)
        ml_score = max(1, min(100, int(100 - (rsi * 0.6 + (macd + 5) * 10))))
        
        results.append({
            "ticker": ticker,
            "ml_score": ml_score,
            "rsi": rsi,
            "macd": macd
        })
    
    return results

@app.post("/api/stock-data", response_model=List[StockDataResponse])
def get_stock_data(request: StockDataRequest):
    """
    Returns real-time stock quote data using yfinance for requested tickers.
    """
    if not request.tickers:
        raise HTTPException(status_code=400, detail="Tickers list cannot be empty")

    results = []
    for ticker in request.tickers:
        symbol = str(ticker or "").strip().upper()
        if not symbol:
            continue

        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            current_price = info.get("regularMarketPrice") or info.get("currentPrice")
            previous_close = info.get("previousClose")
            name = info.get("shortName") or info.get("longName") or symbol

            if current_price is None:
                history = stock.history(period="1d")
                if not history.empty:
                    current_price = float(history["Close"].iloc[-1])
                    previous_close = float(history["Close"].iloc[-1])

            if current_price is None:
                raise ValueError("No current price available")

            results.append({
                "ticker": symbol,
                "currentPrice": round(current_price, 2),
                "previousClose": round(previous_close or current_price, 2),
                "name": name,
            })
        except Exception as error:
            raise HTTPException(status_code=400, detail=f"Unable to fetch data for {symbol}: {error}")

    return results

@app.get("/api/stock-search")
def search_stocks(query: str):
    """
    Search for stocks using Yahoo Finance search.
    """
    if not query:
        return []

    try:
        results = search(query)
        quotes = results.get('quotes', [])
        return [{"symbol": q.get('symbol', ''), "name": q.get('shortname', '') or q.get('longname', ''), "type": q.get('typeDisp', '')} for q in quotes[:10] if q.get('symbol')]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
