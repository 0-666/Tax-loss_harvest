from pydantic import BaseModel

class StockData(BaseModel):
    loss: float
    rsi: float
    macd: float
    sma: float