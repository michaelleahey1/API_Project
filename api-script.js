// Navigation between sections
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and sections
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.api-section').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding section
        const section = btn.dataset.section;
        document.getElementById(section).classList.add('active');
    });
});

// ========== WEATHER API ==========
async function fetchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    
    if (!city) {
        resultDiv.innerHTML = '<p class="error">Please enter a city name</p>';
        return;
    }
    
    resultDiv.innerHTML = '<p class="loading">Fetching weather data</p>';
    
    try {
        // Using Open-Meteo API (free, no API key required)
        // First, get coordinates from city name
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }
        
        const { latitude, longitude, name, country } = geoData.results[0];
        
        // Get weather data
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`);
        const weatherData = await weatherResponse.json();
        
        displayWeather(weatherData, name, country);
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function displayWeather(data, city, country) {
    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const weatherCode = current.weather_code;
    
    // Simple weather code to emoji mapping
    const weatherEmojis = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌧️', 53: '🌧️', 55: '🌧️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        71: '🌨️', 73: '🌨️', 75: '🌨️',
        95: '⛈️', 96: '⛈️', 99: '⛈️'
    };
    
    const emoji = weatherEmojis[weatherCode] || '🌤️';
    
    const html = `
        <div class="weather-card">
            <div class="weather-icon">${emoji}</div>
            <div class="weather-info">
                <h3>${city}, ${country}</h3>
                <div class="temperature">${temp}°C</div>
                <div class="weather-details">
                    <div class="detail">
                        <div class="detail-label">Humidity</div>
                        <div class="detail-value">${current.relative_humidity_2m}%</div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">Wind Speed</div>
                        <div class="detail-value">${current.wind_speed_10m} km/h</div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">Time</div>
                        <div class="detail-value">${new Date(current.time).toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('weatherResult').innerHTML = html;
}

// ========== RANDOM USERS API ==========
async function fetchRandomUsers() {
    const count = document.getElementById('userCount').value;
    const resultDiv = document.getElementById('usersResult');
    
    resultDiv.innerHTML = '<p class="loading">Generating random users</p>';
    
    try {
        const response = await fetch(`https://randomuser.me/api/?results=${count}`);
        const data = await response.json();
        
        if (!data.results) {
            throw new Error('No users found');
        }
        
        displayUsers(data.results);
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function displayUsers(users) {
    const html = users.map(user => `
        <div class="user-card">
            <img src="${user.picture.large}" alt="${user.name.first}" class="user-avatar">
            <div class="user-name">${user.name.first} ${user.name.last}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-info">
                <p><strong>📍 Location:</strong> ${user.location.city}, ${user.location.country}</p>
                <p><strong>📞 Phone:</strong> ${user.phone}</p>
                <p><strong>🎂 Age:</strong> ${user.dob.age} years old</p>
                <p><strong>👤 Username:</strong> ${user.login.username}</p>
            </div>
        </div>
    `).join('');
    
    document.getElementById('usersResult').innerHTML = html;
}

// ========== COUNTRIES API ==========
async function fetchCountry() {
    const country = document.getElementById('countryInput').value.trim();
    const resultDiv = document.getElementById('countryResult');
    
    if (!country) {
        resultDiv.innerHTML = '<p class="error">Please enter a country name</p>';
        return;
    }
    
    resultDiv.innerHTML = '<p class="loading">Fetching country data</p>';
    
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`);
        const data = await response.json();
        
        if (data.status === 404) {
            throw new Error('Country not found');
        }
        
        displayCountry(data[0]);
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function displayCountry(country) {
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    const currencies = country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A';
    
    const html = `
        <div class="country-card">
            <img src="${country.flags.png}" alt="${country.name.common} flag" class="country-flag">
            <div class="country-info">
                <h3>${country.name.common}</h3>
                <div class="country-details">
                    <div class="detail">
                        <div class="detail-label">Official Name</div>
                        <div class="detail-value" style="font-size: 1rem;">${country.name.official}</div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">Capital</div>
                        <div class="detail-value">${country.capital ? country.capital[0] : 'N/A'}</div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">Population</div>
                        <div class="detail-value">${country.population.toLocaleString()}</div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">Region</div>
                        <div class="detail-value">${country.region}</div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">Languages</div>
                        <div class="detail-value" style="font-size: 0.9rem;">${languages}</div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">Currency</div>
                        <div class="detail-value" style="font-size: 0.9rem;">${currencies}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('countryResult').innerHTML = html;
}

// ========== QUOTES API ==========
async function fetchQuote() {
    const resultDiv = document.getElementById('quoteResult');
    resultDiv.innerHTML = '<p class="loading">Fetching quote</p>';
    
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        displayQuote(data);
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

async function fetchQuoteByTag(tag) {
    const resultDiv = document.getElementById('quoteResult');
    resultDiv.innerHTML = '<p class="loading">Fetching quote</p>';
    
    try {
        const response = await fetch(`https://api.quotable.io/random?tags=${tag}`);
        const data = await response.json();
        displayQuote(data);
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function displayQuote(quote) {
    const html = `
        <div class="quote-text">${quote.content}</div>
        <div class="quote-author">— ${quote.author}</div>
    `;
    document.getElementById('quoteResult').innerHTML = html;
}

// ========== JOKES API ==========
async function fetchJoke() {
    const resultDiv = document.getElementById('jokeResult');
    resultDiv.innerHTML = '<p class="loading">Fetching joke</p>';
    
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
        const data = await response.json();
        displayJoke(data);
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function displayJoke(joke) {
    let html = '';
    
    if (joke.type === 'single') {
        html = `<div class="joke-text">${joke.joke}</div>`;
    } else {
        html = `
            <div class="joke-text">${joke.setup}</div>
            <div class="joke-punchline">${joke.delivery}</div>
        `;
    }
    
    document.getElementById('jokeResult').innerHTML = html;
}

// ========== DOG IMAGES API ==========
async function fetchDogImage() {
    const resultDiv = document.getElementById('dogResult');
    resultDiv.innerHTML = '<p class="loading">Fetching dog image</p>';
    
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        
        if (data.status !== 'success') {
            throw new Error('Failed to fetch dog image');
        }
        
        const html = `<img src="${data.message}" alt="Random dog" class="dog-image">`;
        resultDiv.innerHTML = html;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

async function fetchMultipleDogs() {
    const resultDiv = document.getElementById('dogResult');
    resultDiv.innerHTML = '<p class="loading">Fetching dog images</p>';
    
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random/3');
        const data = await response.json();
        
        if (data.status !== 'success') {
            throw new Error('Failed to fetch dog images');
        }
        
        const html = data.message.map(img => 
            `<img src="${img}" alt="Random dog" class="dog-image">`
        ).join('');
        
        resultDiv.innerHTML = html;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Load weather on page load
window.addEventListener('load', () => {
    fetchWeather();
});

