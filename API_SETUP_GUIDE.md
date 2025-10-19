# Marketstack API Setup Guide

## 🚀 Quick Start - Get Your Free API Key

### Step 1: Sign Up for Marketstack (Free)

1. **Visit**: [https://marketstack.com](https://marketstack.com)
2. **Click**: "Sign Up Free" or "Get API Key"
3. **Fill out** the registration form with:
   - Your email address
   - Create a password
   - Your name
4. **Verify** your email address

### Step 2: Get Your API Key

1. After signing up, you'll be redirected to your **dashboard**
2. Your **API Key** will be displayed prominently
3. **Copy** your API key (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 3: Use Your API Key

1. Open `index.html` in your browser
2. Scroll down to the **"Live Stock Market Data"** section
3. **Paste** your API key in the input field
4. Click **"Save API Key"**
5. Watch as popular stocks automatically load!

---

## 📊 What You Get with the Free Plan

✅ **1,000 API requests per month**  
✅ **End-of-Day (EOD) stock data**  
✅ **30,000+ stock tickers worldwide**  
✅ **Historical data** (15+ years)  
✅ **No credit card required**  
✅ **No contract or commitment**

---

## 🔍 Example Stock Symbols to Try

- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet (Google)
- **AMZN** - Amazon
- **TSLA** - Tesla
- **META** - Meta Platforms (Facebook)
- **NVDA** - NVIDIA
- **JPM** - JPMorgan Chase
- **V** - Visa
- **WMT** - Walmart

---

## 🛠️ How the Integration Works

### API Endpoint Used

```
http://api.marketstack.com/v1/eod/latest?access_key=YOUR_API_KEY&symbols=AAPL
```

### Response Format (JSON)

```json
{
  "data": [
    {
      "symbol": "AAPL",
      "exchange": "NASDAQ",
      "date": "2025-10-19",
      "open": 150.25,
      "high": 152.50,
      "low": 149.80,
      "close": 151.75,
      "volume": 75432100
    }
  ]
}
```

### Data Displayed

- **Close Price**: Last trading price of the day
- **Open Price**: First trading price of the day
- **High**: Highest price during the trading day
- **Low**: Lowest price during the trading day
- **Change**: Difference between close and open ($ and %)
- **Volume**: Number of shares traded

---

## 🔒 Security Note

Your API key is stored in your browser's **localStorage** for convenience. This means:

- ✅ You don't need to enter it every time
- ✅ It stays on your computer
- ⚠️ **Never share your API key publicly**
- ⚠️ Don't commit it to public repositories

To clear your saved API key, open your browser console and run:
```javascript
localStorage.removeItem('marketstack_api_key');
```

---

## 📈 API Rate Limits

**Free Plan**: 1,000 requests/month
- That's about **33 requests per day**
- Each search uses **1 request**
- Loading popular stocks uses **1 request** (fetches 6 stocks at once)

**Tip**: The popular stocks are loaded once when you save your API key, so you can click them to view details without using extra requests!

---

## 🆙 Upgrade Options

Need more requests or real-time data?

| Plan | Requests/Month | Price |
|------|---------------|-------|
| **Free** | 1,000 | $0 |
| **Basic** | 10,000 | $9.99/mo |
| **Professional** | 100,000 | $49.99/mo |
| **Business** | 1,000,000 | $149.99/mo |

Visit [Marketstack Pricing](https://marketstack.com/product) for more details.

---

## ❓ Troubleshooting

### "Please enter and save your API key first"
- Make sure you've entered your API key and clicked "Save API Key"

### "Error: Invalid access key"
- Check that you copied the entire API key correctly
- Make sure there are no extra spaces

### "Error: No data found for this symbol"
- Verify the stock symbol is correct
- Some symbols may not be available in the free tier
- Try a common symbol like AAPL or MSFT

### "Error loading stocks"
- Check your internet connection
- Verify your API key is valid
- Make sure you haven't exceeded your monthly limit

---

## 📚 Additional Resources

- **Marketstack Documentation**: [https://marketstack.com/documentation](https://marketstack.com/documentation)
- **Stock Symbol Search**: [https://marketstack.com/stock_search](https://marketstack.com/stock_search)
- **API Status**: [https://marketstack.com/status](https://marketstack.com/status)
- **Support**: [https://marketstack.com/contact](https://marketstack.com/contact)

---

## 🎉 You're All Set!

Start exploring stock market data with your new Marketstack-powered website!

