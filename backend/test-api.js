// test-api.js - Quick test for the /api/simulate endpoint

const axios = require('axios');

async function testSimulation() {
  try {
    console.log('Testing /api/simulate endpoint...\n');

    const testData = {
      targetOffset: 50000,
      lockedAssets: [],
      portfolio: null // Will use mock portfolio
    };

    const response = await axios.post('http://localhost:5000/api/simulate', testData);

    console.log('✅ Simulation Success!\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));

    // Print summary
    console.log('\n📊 Summary:');
    console.log(`- Assets Harvested: ${response.data.metrics.assetsHarvested}`);
    console.log(`- Total Tax Savings: $${response.data.metrics.totalTaxSavings.toFixed(2)}`);
    console.log(`- Harvested Value: $${response.data.metrics.totalHarvestedValue.toFixed(2)}`);
    console.log(`- Offset Met: ${response.data.metrics.offsetMet}`);

    console.log('\n🎯 Top Recommendations:');
    response.data.selectedAssets.slice(0, 3).forEach((asset, i) => {
      console.log(
        `${i + 1}. ${asset.ticker} - Score: ${asset.harvestScore.toFixed(2)}, Tax Savings: $${asset.taxSavings.toFixed(2)}`
      );
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function testMLService() {
  try {
    console.log('\nTesting Python ML Service...\n');

    const testData = {
      tickers: ['AAPL', 'MSFT', 'GOOGL', 'TSLA']
    };

    const response = await axios.post('http://localhost:8000/api/ml-score', testData);

    console.log('✅ ML Scoring Success!\n');
    response.data.forEach(score => {
      console.log(`${score.ticker}: ML Score=${score.ml_score}, RSI=${score.rsi}, MACD=${score.macd}`);
    });

  } catch (error) {
    console.error('❌ ML Service Error:', error.message);
    console.log('   Make sure Python FastAPI service is running on port 8000');
  }
}

// Run tests
(async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Tax-Loss Harvesting API Tests');
  console.log('═══════════════════════════════════════════════════════\n');

  await testSimulation();
  await testMLService();

  console.log('\n═══════════════════════════════════════════════════════');
})();
