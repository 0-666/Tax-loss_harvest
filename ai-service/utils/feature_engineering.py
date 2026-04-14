import yfinance as yf
import pandas as pd
import ta

def get_stock_features(symbol):
    df = yf.download(symbol, period="6mo", interval="1d")

    if df.empty:
        return None

    df.dropna(inplace=True)

    # 🔥 Indicators
    df["rsi"] = ta.momentum.RSIIndicator(df["Close"]).rsi()
    df["macd"] = ta.trend.MACD(df["Close"]).macd()
    df["sma"] = ta.trend.SMAIndicator(df["Close"], window=20).sma_indicator()

    latest = df.iloc[-1]

    return {
        "current_price": float(latest["Close"]),
        "rsi": float(latest["rsi"]),
        "macd": float(latest["macd"]),
        "sma": float(latest["sma"]),
    }