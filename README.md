# MarketStack Landing Page

A modern, responsive landing page inspired by the MarketStack API website. This project showcases a professional design with smooth animations, clean UI, and best UX practices.

## Features

- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with gradient accents and smooth animations
- **Smooth Animations**: Scroll-triggered animations, hover effects, and interactive elements
- **Performance Optimized**: Lightweight CSS and vanilla JavaScript for fast loading
- **Accessibility**: Semantic HTML structure and proper heading hierarchy

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Google Fonts (Inter)

## Sections

1. **Navigation Bar**: Sticky header with navigation links and call-to-action buttons
2. **Hero Section**: Eye-catching headline with pricing cards
3. **EDGAR Section**: Highlighted feature announcement
4. **Features Grid**: Four key features with icons and descriptions
5. **API Integration**: Information about API capabilities
6. **Global Exchanges**: Data coverage with animated globe visual
7. **JSON API Details**: Technical specifications and security features
8. **Social Proof**: Trust indicators for companies and universities
9. **Call-to-Action**: Final conversion section
10. **Footer**: Comprehensive footer with links and social media

## Getting Started

### Step 1: Get Your Free API Key

1. Visit [Marketstack.com](https://marketstack.com)
2. Sign up for a free account
3. Get your API key (allows 1,000 requests/month on free tier)

### Step 2: Open the Website

Simply open `index.html` in your web browser to view the landing page.

```bash
# No build process required!
# Just open the file in your browser
open index.html
```

### Step 3: Enter Your API Key

1. Scroll to the "Live Stock Market Data" section
2. Enter your Marketstack API key in the input field
3. Click "Save API Key"
4. The page will automatically load popular stocks (AAPL, MSFT, GOOGL, AMZN, TSLA, META)

### Step 4: Search for Stocks

- Enter any stock symbol (e.g., AAPL, TSLA, MSFT) in the search box
- Click "Get Stock Data" to see detailed information including:
  - Close Price
  - Open Price
  - High/Low
  - Daily Change & Percentage
  - Trading Volume
- Click on any popular stock card to instantly view its details

## Customization

### Colors
Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #50E3C2;
    --dark-blue: #1A2B4A;
    /* ... more colors */
}
```

### Content
Edit the content directly in `index.html` to match your needs.

### Animations
Modify animation timing and effects in `script.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a demo project inspired by [MarketStack](https://marketstack.com). Feel free to use and modify for your own projects.

## Credits

Design inspired by MarketStack API landing page.

