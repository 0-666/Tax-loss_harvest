# 🧠 Tax-Loss Harvesting ML Service
The Tax-Loss Harvesting ML Service is a comprehensive platform designed to provide users with a robust tax-loss harvesting strategy. This service utilizes machine learning algorithms to optimize portfolio performance and minimize tax liabilities. The platform consists of a backend API built using FastAPI, a frontend application built using React, and a database managed using MongoDB.

## 🚀 Features
* **Machine Learning Integration**: The service uses XGBoost models to predict harvest scores and optimize portfolio performance.
* **Real-time Stock Data**: The platform retrieves real-time stock quote data using the yfinance library.
* **User Authentication**: The service provides user authentication and authorization using JSON Web Tokens (JWTs).
* **Portfolio Management**: The platform allows users to manage their portfolios, including adding and removing positions, and updating lock status.
* **Tax-Loss Harvesting Simulation**: The service provides a greedy tax-loss harvesting algorithm to simulate the sale of assets and minimize tax liabilities.

## 🛠️ Tech Stack
* **Backend**:
	+ FastAPI for building the API
	+ Pydantic for defining request and response models
	+ yfinance for retrieving stock data
	+ yahooquery for searching stocks
	+ random for simulating ML scores
	+ XGBoost for building the ML model
	+ pandas for data manipulation
	+ numpy for numerical computations
	+ joblib for saving the trained model
	+ sklearn for splitting the data into training and testing sets
* **Frontend**:
	+ React for building the frontend application
	+ React Router for client-side routing
	+ Axios for making HTTP requests to the backend API
* **Database**:
	+ MongoDB for storing user data and portfolio information
	+ Mongoose for interacting with the database

## 📦 Installation
To install the project, follow these steps:
1. Clone the repository using `git clone https://github.com/your-repo/tax-loss-harvesting-ml-service.git`
2. Install the required dependencies using `pip install -r requirements.txt` for the backend and `npm install` for the frontend
3. Set up the database by running `mongod` and creating a new database
4. Start the backend server using `uvicorn main:app --host 0.0.0.0 --port 8000`
5. Start the frontend application using `npm start`

## 💻 Usage
To use the platform, follow these steps:
1. Register a new user account by sending a POST request to `/api/register`
2. Log in to the application by sending a POST request to `/api/login`
3. Retrieve the user's portfolio by sending a GET request to `/api/portfolio`
4. Add a new position to the portfolio by sending a POST request to `/api/portfolio/add`
5. Update the lock status of a position by sending a PATCH request to `/api/portfolio/update`

## 📂 Project Structure
```markdown
tax-loss-harvesting-ml-service/
├── ai-service/
│   ├── app.py
│   ├── train.py
│   ├── utils/
│   │   ├── feature_engineering.py
│   │   ├── data_provider.py
│   ├── models/
│   │   ├── xgboost_model.py
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   ├── package.json
├── backend/
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   ├── controller/
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   ├── model/
│   │   ├── userModel.js
│   │   ├── portfolioModel.js
│   ├── routes/
│   │   ├── simulator.js
│   │   ├── portfolioRoute.js
│   ├── package.json
```

## 📸 Screenshots
<img width="1728" height="865" alt="Screenshot 2026-04-14 143147" src="https://github.com/user-attachments/assets/ac6ee7db-b430-457a-9887-8cf258d4b15d" />

<img width="1918" height="877" alt="Screenshot 2026-04-14 143228" src="https://github.com/user-attachments/assets/78c758f9-4901-4133-9602-50e7ab64bbbc" />

<img width="1919" height="876" alt="Screenshot 2026-04-14 143302" src="https://github.com/user-attachments/assets/1ba2b031-af2e-4079-9d49-f0451d9d1069" />

<img width="1917" height="873" alt="Screenshot 2026-04-14 143351" src="https://github.com/user-attachments/assets/1533bda9-28f0-4ef0-8d16-7b8e48d676e0" />



## 📝 License
The project is licensed under the MIT License.

## 📬 Contact
For any questions or concerns, please contact us at [snikhil3290@gmail.com](mailto:snikhil3290@gmail.com).


## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### Installation

**1. Install Frontend Dependencies**
```bash
cd frontend
npm install
```

**2. Install Backend Dependencies**
```bash
cd backend
npm install
```

**3. Install Python Dependencies**
```bash
cd ai-service
pip install fastapi uvicorn pydantic
```

### Running the Application

**Terminal 1: Start Python FastAPI Service**
```bash
cd ai-service
python app.py
# Service runs on http://localhost:8000
```

**Terminal 2: Start Node.js Backend**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 3: Start React Frontend**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5175 (or next available port)
```

Visit `http://localhost:5175` in your browser to access the application.

## 📊 Algorithm Details

### Greedy Tax-Loss Harvesting Algorithm

**Input:**
- `targetOffset`: Dollar amount of tax loss to harvest
- `lockedAssets`: Array of tickers to exclude
- `portfolio`: Array of position objects

**Process:**

1. **Calculate Unrealized P/L for Each Position**
   ```
   Unrealized P/L = (Current Price − Buy Price) × Quantity
   Tax Savings = |Loss| × 0.20  (20% fixed tax rate)
   ```

2. **Fetch ML Scores from Python Service**
   - Calls `/api/ml-score` with list of tickers
   - Gets RSI and MACD-based performance ratings (1-100)

3. **Calculate Harvest Score (Greedy Metric)**
   ```
   Harvest Score = |Unrealized Loss| ÷ ML Rating
   
   Higher score = better candidate for harvesting
   (maximizes tax savings per unit of risk)
   ```

4. **Greedy Selection**
   - Sort candidates by `Harvest Score` (descending)
   - Select assets sequentially until target offset met
   - Skip any `lockedAssets`

5. **Return Results**
   - Selected assets with detailed breakdown
   - Portfolio-level metrics
   - Tax savings summary

### Financial Formulas

```javascript
// Price-to-Book Ratio
Unrealized P/L = (Current Price − Buy Price) × Quantity

// Tax Benefit
Tax Savings = |Loss| × Tax Rate (0.20)

// Harvest Score (Greedy Metric)
Harvest Score = |Unrealized Loss| ÷ ML Rating

// Portfolio Metrics
Net Portfolio Gain = Sum of all Unrealized P/L
Portfolio Value = Sum of (Current Price × Quantity)
```

### Constraints

- **Maximum Positions:** 200 portfolio items
- **Tax Rate:** Fixed at 20%
- **Price Precision:** 2 decimal places
- **Wash-Sale Rules:** Ignored for simplicity

## 🔌 API Endpoints

### Backend (`POST /api/simulate`)

**Request:**
```json
{
  "targetOffset": 50000,
  "lockedAssets": ["AAPL", "MSFT"],
  "portfolio": [
    {
      "ticker": "GOOGL",
      "name": "Alphabet Inc.",
      "quantity": 30,
      "buyPrice": 150.75,
      "currentPrice": 138.50,
      "sector": "Technology"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-04-14T10:00:00.000Z",
  "selectedAssets": [
    {
      "ticker": "TSLA",
      "unrealizedPL": -4102.50,
      "taxSavings": 820.50,
      "mlRating": 65,
      "harvestScore": 63.12,
      "quantity": 75,
      "buyPrice": 240.00,
      "currentPrice": 185.30
    }
  ],
  "metrics": {
    "assetsHarvested": 4,
    "totalHarvestedValue": 15234.50,
    "totalTaxSavings": 3046.90,
    "netPortfolioGain": -8502.25,
    "portfolioValue": 125000.00,
    "offsetMet": "Full offset achieved"
  }
}
```

### Python ML Service (`POST /api/ml-score`)

**Request:**
```json
{
  "tickers": ["AAPL", "MSFT", "GOOGL"]
}
```

**Response:**
```json
[
  {
    "ticker": "AAPL",
    "ml_score": 67,
    "rsi": 45.23,
    "macd": -1.45
  },
  {
    "ticker": "MSFT",
    "ml_score": 52,
    "rsi": 58.91,
    "macd": 2.34
  }
]
```

## 🎨 Frontend Components

### Dashboard.jsx
Main orchestrator component that manages:
- Portfolio data state
- Simulation parameters
- API calls to backend
- Toast notifications

### MetricsRow.jsx
Displays key performance indicators:
- Total Tax Saved
- Assets Harvested
- Net Portfolio Gain
- Portfolio Value

### PortfolioTable.jsx
Interactive table showing:
- All portfolio positions
- Current vs. buy prices
- P/L and tax savings
- Lock/Unlock toggle buttons

### RecommendationList.jsx
List of recommended harvests with:
- Ticker and company name
- Harvest score ranking
- Tax savings breakdown
- ML rating details

### HarvestChart.jsx
Visual breakdown showing:
- Horizontal bar charts for tax savings
- Asset distribution legend
- Percentage contribution


## 🔐 Authentication

Authentication routes (`/api/auth/login`, `/api/auth/register`) are available but the simulator runs without authentication. To add authentication:

1. Check for JWT token in localStorage
2. Wrap Dashboard with PrivateRoute component
3. Add auth middleware to `/api/simulate` endpoint

## 🧪 Testing the Simulation

**Manual API Test:**
```bash
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"targetOffset": 50000}'
```

**Frontend Test:**
1. Open http://localhost:5175
2. Enter target offset (e.g., $50,000)
3. Optionally lock assets
4. Click "Run Simulation"
5. View results and recommendations

## 📈 Example Output

With the mock portfolio (10 positions):

```
Target Offset: $50,000
Locked Assets: None

Results:
- Assets Harvested: 4
- Total Tax Saved: $3,046.90
- Harvested Value: $15,234.50
- Offset Status: Full offset achieved

Top Recommendations:
1. TSLA (Harvest Score: 63.12) → Tax Savings: $820.50
2. GOOGL (Harvest Score: 48.75) → Tax Savings: $615.25
3. JPM (Harvest Score: 45.38) → Tax Savings: $533.20
4. BA (Harvest Score: 42.15) → Tax Savings: $477.95
```

## 🚀 Optimization Notes

- The algorithm is **O(n log n)** due to sorting by harvest score
- ML service calls are made once per simulation (batch request)
- Mock portfolio can be swapped with live API data
- All calculations use fixed 2-decimal precision for financial accuracy

## 🛠️ Future Enhancements

1. **Wash-Sale Rules:** Add 30-day lookback logic
2. **Tax Reports:** Generate PDF tax documents
3. **Backtesting:** Simulate harvesting strategies over time

## 📄 License

MIT © 2026 Tax-Loss Harvesting Team

