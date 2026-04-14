import yfinance as yf
import json
import ta

# Load mock data once
with open("data/mock_data.json") as f:
    mock_data = json.load(f)


def get_stock_data(symbol):
    try:
        # 🔥 Try real API
        df = yf.download(symbol, period="3mo", interval="1d")

        if df.empty:
            raise Exception("Empty API response")

        df.dropna(inplace=True)

        # Indicators
        df["rsi"] = ta.momentum.RSIIndicator(df["Close"]).rsi()
        df["macd"] = ta.trend.MACD(df["Close"]).macd()
        df["sma"] = ta.trend.SMAIndicator(df["Close"], window=20).sma_indicator()

        latest = df.iloc[-1]

        return {
            "price": float(latest["Close"]),
            "rsi": float(latest["rsi"]),
            "macd": float(latest["macd"]),
            "sma": float(latest["sma"]),
            "source": "api"
        }

    except Exception as e:
        # ⚠️ Fallback to mock
        if symbol in mock_data:
            data = mock_data[symbol]
            return {
                "price": data["price"],
                "rsi": data["rsi"],
                "macd": data["macd"],
                "sma": data["sma"],
                "source": "mock"
            }

        return None