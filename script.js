// Marketstack API Integration
let apiKey = localStorage.getItem('marketstack_api_key') || '';

// Save API key to localStorage
function saveApiKey() {
    const input = document.getElementById('apiKey');
    apiKey = input.value.trim();
    
    if (apiKey) {
        localStorage.setItem('marketstack_api_key', apiKey);
        alert('API Key saved successfully! You can now fetch stock data.');
        loadPopularStocks();
    } else {
        alert('Please enter a valid API key');
    }
}

// Load saved API key on page load
window.addEventListener('load', () => {
    if (apiKey) {
        document.getElementById('apiKey').value = apiKey;
        loadPopularStocks();
    }
});

// Fetch stock data from Marketstack API
async function fetchStockData() {
    const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
    const display = document.getElementById('stockDataDisplay');
    
    if (!apiKey) {
        display.innerHTML = '<p class="error-message">Please enter and save your API key first. Get a free key at <a href="https://marketstack.com" target="_blank">marketstack.com</a></p>';
        return;
    }
    
    if (!symbol) {
        display.innerHTML = '<p class="error-message">Please enter a stock symbol</p>';
        return;
    }
    
    display.innerHTML = '<p class="loading">Fetching stock data for ' + symbol + '</p>';
    
    try {
        const response = await fetch(`http://api.marketstack.com/v1/eod/latest?access_key=${apiKey}&symbols=${symbol}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No data found for this symbol');
        }
        
        const stockData = data.data[0];
        displayStockData(stockData);
    } catch (error) {
        display.innerHTML = `<p class="error-message">Error: ${error.message}. Please check your API key and symbol.</p>`;
    }
}

// Display stock data in a nice format
function displayStockData(stock) {
    const change = stock.close - stock.open;
    const changePercent = ((change / stock.open) * 100).toFixed(2);
    const isPositive = change >= 0;
    
    const html = `
        <div class="stock-info">
            <h3>${stock.symbol}</h3>
            <p class="symbol">${stock.exchange || 'Stock Exchange'}</p>
            <div class="stock-details">
                <div class="detail-item">
                    <div class="detail-label">Close Price</div>
                    <div class="detail-value">$${stock.close.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Open Price</div>
                    <div class="detail-value">$${stock.open.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">High</div>
                    <div class="detail-value">$${stock.high.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Low</div>
                    <div class="detail-value">$${stock.low.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Change</div>
                    <div class="detail-value ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}$${change.toFixed(2)} (${isPositive ? '+' : ''}${changePercent}%)
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Volume</div>
                    <div class="detail-value">${stock.volume.toLocaleString()}</div>
                </div>
            </div>
            <p style="margin-top: 1.5rem; color: var(--text-light); font-size: 0.9rem;">
                Data as of: ${new Date(stock.date).toLocaleDateString()}
            </p>
        </div>
    `;
    
    document.getElementById('stockDataDisplay').innerHTML = html;
}

// Load popular stocks
async function loadPopularStocks() {
    if (!apiKey) return;
    
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META'];
    const grid = document.getElementById('popularStocksGrid');
    grid.innerHTML = '<p class="loading">Loading popular stocks</p>';
    
    try {
        const response = await fetch(`http://api.marketstack.com/v1/eod/latest?access_key=${apiKey}&symbols=${symbols.join(',')}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No data available');
        }
        
        displayPopularStocks(data.data);
    } catch (error) {
        grid.innerHTML = `<div class="stock-card-placeholder"><p class="error-message">Error loading stocks: ${error.message}</p></div>`;
    }
}

// Display popular stocks in grid
function displayPopularStocks(stocks) {
    const grid = document.getElementById('popularStocksGrid');
    
    const stockNames = {
        'AAPL': 'Apple Inc.',
        'MSFT': 'Microsoft Corporation',
        'GOOGL': 'Alphabet Inc.',
        'AMZN': 'Amazon.com Inc.',
        'TSLA': 'Tesla Inc.',
        'META': 'Meta Platforms Inc.'
    };
    
    grid.innerHTML = stocks.map(stock => {
        const change = stock.close - stock.open;
        const changePercent = ((change / stock.open) * 100).toFixed(2);
        const isPositive = change >= 0;
        
        return `
            <div class="stock-card" onclick="document.getElementById('stockSymbol').value='${stock.symbol}'; fetchStockData();">
                <div class="stock-card-header">
                    <span class="stock-symbol">${stock.symbol}</span>
                </div>
                <div class="stock-name">${stockNames[stock.symbol] || stock.exchange}</div>
                <div class="stock-price">$${stock.close.toFixed(2)}</div>
                <span class="stock-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '↑' : '↓'} ${isPositive ? '+' : ''}${changePercent}%
                </span>
            </div>
        `;
    }).join('');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and other elements
document.querySelectorAll('.feature-card, .hero-card, .json-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Add hover effect to cards
document.querySelectorAll('.hero-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Animate numbers on scroll (for stats)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add parallax effect to globe
window.addEventListener('scroll', () => {
    const globe = document.querySelector('.globe');
    if (globe) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        globe.style.transform = `translateY(${parallax}px) rotate(${scrolled * 0.05}deg)`;
    }
});

// Mobile menu toggle (for future implementation)
const createMobileMenu = () => {
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';
    
    if (window.innerWidth <= 768) {
        menuButton.style.display = 'block';
    }
    
    document.querySelector('.nav-content').appendChild(menuButton);
};

// Initialize on load
window.addEventListener('load', () => {
    // Add entrance animation to hero
    const hero = document.querySelector('.hero');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 100);
});

// Add click ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

