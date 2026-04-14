import pandas as pd
import numpy as np
import joblib
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split

# 🔥 Synthetic dataset (hackathon friendly but realistic)
np.random.seed(42)

data = pd.DataFrame({
    "loss": np.random.randint(100, 20000, 500),
    "rsi": np.random.randint(10, 90, 500),
    "macd": np.random.uniform(-5, 5, 500),
    "sma": np.random.randint(50, 500, 500),
})

# 💡 Target (Harvest Score Logic)
data["target"] = (
    data["loss"] * 0.20 +           # tax saving
    (100 - data["rsi"]) * 2 +       # lower RSI = better sell
    data["macd"] * 10               # trend impact
)

X = data[["loss", "rsi", "macd", "sma"]]
y = data["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 🚀 XGBoost Model
model = XGBRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=5,
    subsample=0.8,
    colsample_bytree=0.8
)

model.fit(X_train, y_train)

# Save model
joblib.dump(model, "model/xgb_model.pkl")

print("✅ XGBoost model trained & saved")