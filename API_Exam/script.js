// Marketstack API Configuration
const API_KEY = '576f8b00a28c970345dc03c435d3809d';
const API_BASE_URL = 'https://api.marketstack.com/v1';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtn = document.getElementById('filterBtn');
const resetBtn = document.getElementById('resetBtn');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const resultsGrid = document.getElementById('resultsGrid');
const skeletonLoader = document.getElementById('skeletonLoader');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const emptyState = document.getElementById('emptyState');
const resultsCount = document.getElementById('resultsCount');
const stockChips = document.querySelectorAll('.stock-chip');
const navLinks = document.querySelectorAll('.nav-link');
const trendingGrid = document.getElementById('trendingGrid');
const trendingLoader = document.getElementById('trendingLoader');

// State
let currentStockData = [];
let filteredStockData = [];
let trendingStocksLoaded = false;

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

filterBtn.addEventListener('click', applyFilter);
resetBtn.addEventListener('click', resetFilters);

for (const chip of stockChips) {
    chip.addEventListener('click', () => {
        const symbol = chip.dataset.symbol;
        searchInput.value = symbol;
        handleSearch();
    });
}

// Navigation handling
for (const link of navLinks) {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        switchSection(section);
        
        // Update active nav link
        for (const navLink of navLinks) {
            navLink.classList.remove('active');
        }
        link.classList.add('active');
    });
}

// Navigation Functions
function switchSection(sectionName) {
    // Hide all sections
    const allSections = document.querySelectorAll('.content-section');
    for (const section of allSections) {
        section.classList.remove('active');
    }
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load trending stocks if trending section is opened
    if (sectionName === 'trending' && !trendingStocksLoaded) {
        loadTrendingStocks();
    }
}

async function loadTrendingStocks() {
    const trendingSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];
    
    trendingLoader.classList.remove('hidden');
    trendingGrid.innerHTML = '';
    
    try {
        const symbolsString = trendingSymbols.join(',');
        const response = await fetch(
            `${API_BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbolsString}&limit=8`
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }

        if (!data.data || data.data.length === 0) {
            throw new Error('No trending data available');
        }

        trendingStocksLoaded = true;
        
        for (const stock of data.data) {
            const card = createStockCard(stock);
            trendingGrid.appendChild(card);
        }
        
        trendingLoader.classList.add('hidden');

    } catch (error) {
        console.error('Error loading trending stocks:', error);
        trendingLoader.classList.add('hidden');
        trendingGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Failed to load trending stocks. Please try again later.</span>
            </div>
        `;
    }
}

// Main Functions
async function handleSearch() {
    const symbol = searchInput.value.trim().toUpperCase();
    
    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }

    showLoading();
    hideError();
    hideEmptyState();

    try {
        // Fetch End of Day data for the symbol
        const response = await fetch(
            `${API_BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbol}&limit=1`
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }

        if (!data.data || data.data.length === 0) {
            throw new Error('No data found for this symbol');
        }

        currentStockData = data.data;
        filteredStockData = [...currentStockData];
        
        displayResults(filteredStockData);
        hideLoading();

    } catch (error) {
        console.error('Error fetching stock data:', error);
        showError(error.message || 'Failed to fetch stock data. Please try again.');
        hideLoading();
        currentStockData = [];
        filteredStockData = [];
    }
}

async function fetchMultipleSymbols(symbols) {
    showLoading();
    hideError();
    hideEmptyState();

    try {
        const symbolsString = symbols.join(',');
        const response = await fetch(
            `${API_BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbolsString}&limit=10`
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }

        if (!data.data || data.data.length === 0) {
            throw new Error('No data found');
        }

        currentStockData = data.data;
        filteredStockData = [...currentStockData];
        
        displayResults(filteredStockData);
        hideLoading();

    } catch (error) {
        console.error('Error fetching stock data:', error);
        showError(error.message || 'Failed to fetch stock data. Please try again.');
        hideLoading();
    }
}

function applyFilter() {
    const minPrice = Number.parseFloat(minPriceInput.value) || 0;
    const maxPrice = Number.parseFloat(maxPriceInput.value) || Infinity;

    if (minPrice > maxPrice) {
        showError('Minimum price cannot be greater than maximum price');
        return;
    }

    hideError();

    filteredStockData = currentStockData.filter(stock => {
        const price = stock.close || 0;
        return price >= minPrice && price <= maxPrice;
    });

    if (filteredStockData.length === 0) {
        showError('No stocks match the selected price range');
        resultsGrid.innerHTML = '';
        resultsCount.textContent = '';
    } else {
        displayResults(filteredStockData);
    }
}

function resetFilters() {
    minPriceInput.value = '';
    maxPriceInput.value = '';
    filteredStockData = [...currentStockData];
    
    if (currentStockData.length > 0) {
        displayResults(filteredStockData);
    }
    
    hideError();
}

function displayResults(stockData) {
    resultsGrid.innerHTML = '';
    
    if (stockData.length === 0) {
        showEmptyState();
        resultsCount.textContent = '';
        return;
    }

    resultsCount.textContent = `${stockData.length} ${stockData.length === 1 ? 'result' : 'results'}`;

    for (const stock of stockData) {
        const card = createStockCard(stock);
        resultsGrid.appendChild(card);
    }
}

function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = 'stock-card';

    // Calculate price change
    const priceChange = stock.close - stock.open;
    const priceChangePercent = (priceChange / stock.open) * 100;
    const isPositive = priceChange >= 0;

    // Get initials for icon
    const initials = stock.symbol.substring(0, 2).toUpperCase();

    // Format date
    const date = new Date(stock.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });

    card.innerHTML = `
        <div class="stock-header">
            <div class="stock-icon">${initials}</div>
            <div class="stock-info">
                <h4>${stock.symbol}</h4>
                <span class="stock-exchange">${stock.exchange || 'N/A'}</span>
            </div>
        </div>
        <div class="stock-details">
            <div class="detail-row">
                <span class="detail-label">Close Price</span>
                <span class="detail-value price-value">$${stock.close ? stock.close.toFixed(2) : 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Change</span>
                <span class="price-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)} (${Math.abs(priceChangePercent).toFixed(2)}%)
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Open</span>
                <span class="detail-value">$${stock.open ? stock.open.toFixed(2) : 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">High</span>
                <span class="detail-value">$${stock.high ? stock.high.toFixed(2) : 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Low</span>
                <span class="detail-value">$${stock.low ? stock.low.toFixed(2) : 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Volume</span>
                <span class="detail-value">${stock.volume ? stock.volume.toLocaleString() : 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formattedDate}</span>
            </div>
        </div>
    `;

    return card;
}

function showLoading() {
    skeletonLoader.classList.remove('hidden');
    resultsGrid.classList.add('hidden');
    errorMessage.classList.add('hidden');
    emptyState.classList.add('hidden');
}

function hideLoading() {
    skeletonLoader.classList.add('hidden');
    resultsGrid.classList.remove('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    emptyState.classList.add('hidden');
    resultsGrid.innerHTML = '';
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showEmptyState() {
    emptyState.classList.remove('hidden');
    resultsGrid.innerHTML = '';
}

function hideEmptyState() {
    emptyState.classList.add('hidden');
}

// Initialize - Load some popular stocks on page load
globalThis.addEventListener('DOMContentLoaded', () => {
    console.log('Stock Market Dashboard loaded');
    console.log('Search for stocks like AAPL, MSFT, GOOGL, or click on popular stocks');
    
    // Auto-load a popular stock as demo
    setTimeout(() => {
        searchInput.value = 'AAPL';
        handleSearch();
    }, 500);
});

