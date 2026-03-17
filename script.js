// Weather Trivia Questions
const weatherTrivia = [
    {
        question: "What is the highest temperature ever recorded on Earth?",
        options: ["56.7°C", "58.2°C", "60.1°C", "55.3°C"],
        correct: 0,
        fact: "The highest temperature was 56.7°C (134°F) recorded in Death Valley, California, USA on July 10, 1913."
    },
    {
        question: "Which type of cloud is closest to the ground?",
        options: ["Cirrus", "Cumulus", "Stratus", "Nimbus"],
        correct: 2,
        fact: "Stratus clouds are low-level clouds that form a continuous layer close to the ground."
    },
    {
        question: "What causes the wind?",
        options: ["Earth's rotation", "Temperature differences", "Ocean currents", "Moon's gravity"],
        correct: 1,
        fact: "Wind is caused by differences in air pressure due to temperature variations."
    },
    {
        question: "What is a hurricane called in the Western Pacific?",
        options: ["Cyclone", "Typhoon", "Tornado", "Monsoon"],
        correct: 1,
        fact: "In the Western Pacific, hurricanes are called typhoons."
    },
    {
        question: "Which gas makes up the largest percentage of Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
        correct: 2,
        fact: "Nitrogen makes up about 78% of Earth's atmosphere."
    },
    {
        question: "What is the lowest temperature ever recorded?",
        options: ["-89.2°C", "-91.4°C", "-87.8°C", "-93.1°C"],
        correct: 0,
        fact: "The lowest temperature was -89.2°C (-128.6°F) recorded at Vostok Station, Antarctica."
    }
];

let currentTrivia = null;

// Game state
let userStats = {
    level: 1,
    xp: 0,
    streak: 0,
    lastCheckDate: null,
    citiesChecked: new Set(),
    weatherTypes: new Set(),
    achievements: new Set(),
    favorites: []
};

// Weather icons mapping
const weatherIcons = {
    'clear sky': '☀️',
    'few clouds': '⛅',
    'scattered clouds': '☁️',
    'broken clouds': '☁️',
    'shower rain': '🌦️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'overcast clouds': '☁️'
};

// Achievement definitions
const achievements = {
    'first-check': { name: 'First Check', icon: '🌤️', description: 'Check weather for the first time' },
    'sunny-day': { name: 'Sunny Day', icon: '☀️', description: 'Experience a sunny day' },
    'rainy-day': { name: 'Rainy Day', icon: '🌧️', description: 'Experience a rainy day' },
    'snowy-day': { name: 'Snowy Day', icon: '❄️', description: 'Experience a snowy day' },
    'streak-7': { name: '7-Day Streak', icon: '🔥', description: 'Check weather for 7 consecutive days' },
    'explorer': { name: 'City Explorer', icon: '🗺️', description: 'Check weather in 5 different cities' }
};

// OpenWeatherMap API Key - Replace with your own API key from https://openweathermap.org/api
const apiKey = '01030523e585679c6c0a41639492aa37';

// Current weather state (used for day/night toggle)
let currentWeatherMain = 'clear';
let currentIsNight = false;

// Curated city background images (professional, high-quality photos)
const cityBackgrounds = {
    // Major Cities
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&h=1080&fit=crop&auto=format',
    'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1920&h=1080&fit=crop&auto=format',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&h=1080&fit=crop&auto=format',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop&auto=format',
    'sydney': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop&auto=format',
    'singapore': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1920&h=1080&fit=crop&auto=format',
    'hong kong': 'https://images.unsplash.com/photo-1536599018102-9a311bed38c7?w=1920&h=1080&fit=crop&auto=format',

    // European Cities
    'berlin': 'https://images.unsplash.com/photo-1560969184-10fe369e4e52?w=1920&h=1080&fit=crop&auto=format',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e963b3b6?w=1920&h=1080&fit=crop&auto=format',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&h=1080&fit=crop&auto=format',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&h=1080&fit=crop&auto=format',
    'vienna': 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1920&h=1080&fit=crop&auto=format',

    // American Cities
    'los angeles': 'https://images.unsplash.com/photo-1534197153588-6b047bfae78f?w=1920&h=1080&fit=crop&auto=format',
    'chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1920&h=1080&fit=crop&auto=format',
    'miami': 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=1920&h=1080&fit=crop&auto=format',
    'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop&auto=format',
    'toronto': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1920&h=1080&fit=crop&auto=format',

    // Asian Cities
    'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&h=1080&fit=crop&auto=format',
    'seoul': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920&h=1080&fit=crop&auto=format',
    'bangkok': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&auto=format',
    'shanghai': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab515?w=1920&h=1080&fit=crop&auto=format',

    // Famous Locations
    'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
    'beach': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
    'forest': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&auto=format',
    'desert': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',

    // Default fallback
    'default': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920&h=1080&fit=crop&auto=format'
};

// Weather animation configurations
const weatherAnimations = {
    clear: {
        particles: 'sun-rays',
        intensity: 'low',
        colors: ['#ffd700', '#ffed4e', '#ffb627']
    },
    clouds: {
        particles: 'clouds',
        intensity: 'medium',
        colors: ['#ecf0f1', '#bdc3c7', '#95a5a6']
    },
    rain: {
        particles: 'rain',
        intensity: 'high',
        colors: ['#3498db', '#2980b9', '#1f4e79']
    },
    drizzle: {
        particles: 'rain',
        intensity: 'medium',
        colors: ['#74b9ff', '#0984e3', '#6c5ce7']
    },
    thunderstorm: {
        particles: 'thunder',
        intensity: 'high',
        colors: ['#2d3436', '#636e72', '#b2bec3']
    },
    snow: {
        particles: 'snow',
        intensity: 'high',
        colors: ['#ffffff', '#ecf0f1', '#bdc3c7']
    },
    mist: {
        particles: 'mist',
        intensity: 'low',
        colors: ['#dfe6e9', '#b2bec3', '#636e72']
    }
};

// Background Map functionality
let backgroundMap;
let currentMapMarker;

function initializeBackgroundMap() {
    // Initialize the map centered on a default location (London)
    backgroundMap = L.map('background-map', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: false,
        touchZoom: false
    }).setView([51.505, -0.09], 10);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(backgroundMap);

    // Add a subtle marker for the current location
    currentMapMarker = L.marker([51.505, -0.09], {
        icon: L.divIcon({
            className: 'map-location-marker',
            html: '<div class="location-pulse"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(backgroundMap);
}

function updateMapLocation(lat, lon, cityName) {
    if (backgroundMap && currentMapMarker) {
        // Update map center
        backgroundMap.setView([lat, lon], 10, {
            animate: true,
            duration: 1.5
        });

        // Update marker position
        currentMapMarker.setLatLng([lat, lon]);

        // Add a subtle city label
        if (currentMapMarker.getPopup()) {
            currentMapMarker.unbindPopup();
        }
        currentMapMarker.bindPopup(`<div class="map-city-label">${cityName}</div>`);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadUserStats();
    updateUI();
    createFloatingElements();
    initializeBackgroundMap();
    document.getElementById('city').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getWeather();
    });
});

// Load user stats from localStorage
function loadUserStats() {
    const saved = localStorage.getItem('weatherQuestStats');
    if (saved) {
        userStats = { ...userStats, ...JSON.parse(saved) };
        userStats.citiesChecked = new Set(userStats.citiesChecked);
        userStats.weatherTypes = new Set(userStats.weatherTypes);
        userStats.achievements = new Set(userStats.achievements);
    }
}

// Save user stats to localStorage
function saveUserStats() {
    const statsToSave = {
        ...userStats,
        citiesChecked: Array.from(userStats.citiesChecked),
        weatherTypes: Array.from(userStats.weatherTypes),
        achievements: Array.from(userStats.achievements)
    };
    localStorage.setItem('weatherQuestStats', JSON.stringify(statsToSave));
}

// Update UI with current stats
function updateUI() {
    document.getElementById('user-level').textContent = userStats.level;
    document.getElementById('user-xp').textContent = userStats.xp;
    document.getElementById('weather-streak').textContent = userStats.streak;
    updateAchievements();
}

// Create floating background elements
function createFloatingElements() {
    const container = document.getElementById('floating-elements');
    const elements = ['🌟', '⭐', '✨', '💫', '🌙', '☁️', '🌤️', '🌈'];

    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 6 + 's';
        element.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        container.appendChild(element);
    }
}

// Create weather particles
function createWeatherParticles(weatherType) {
    const container = document.getElementById('particles');
    container.innerHTML = '';

    let particleClass, particleCount;

    switch (weatherType) {
        case 'rain':
            particleClass = 'rain-particle';
            particleCount = 50;
            break;
        case 'snow':
            particleClass = 'snow-particle';
            particleCount = 30;
            break;
        case 'clear':
            particleClass = 'sun-particle';
            particleCount = 20;
            break;
        default:
            return;
    }

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = particleClass;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 1) + 's';
        container.appendChild(particle);
    }
}

// Set weather theme
let manualNightOverride = null;

function setWeatherTheme(weatherMain, isNight = false) {
    const body = document.body;
    body.className = '';

    // Apply manual override if set (user toggled day/night)
    const effectiveNight = manualNightOverride !== null ? manualNightOverride : isNight;

    // Store for toggle reference
    currentWeatherMain = weatherMain;
    currentIsNight = effectiveNight;

    updateDayNightTag(effectiveNight);

    if (effectiveNight) {
        body.classList.add('night');
        createEnhancedWeatherAnimations('clear', true);
        return;
    }

    switch (weatherMain.toLowerCase()) {
        case 'clear':
            body.classList.add('sunny');
            createEnhancedWeatherAnimations('clear', false);
            break;
        case 'rain':
        case 'drizzle':
            body.classList.add('rainy');
            createEnhancedWeatherAnimations('rain', false);
            break;
        case 'clouds':
            body.classList.add('cloudy');
            createEnhancedWeatherAnimations('clouds', false);
            break;
        case 'snow':
            body.classList.add('snowy');
            createEnhancedWeatherAnimations('snow', false);
            break;
        case 'thunderstorm':
            body.classList.add('stormy');
            createEnhancedWeatherAnimations('thunderstorm', false);
            break;
        case 'mist':
            body.classList.add('cloudy');
            createEnhancedWeatherAnimations('mist', false);
            break;
        default:
            body.classList.add('sunny');
            createEnhancedWeatherAnimations('clear', false);
    }
}

function updateDayNightTag(isNight) {
    const tag = document.getElementById('day-night-tag');
    if (!tag) return;

    if (isNight) {
        tag.textContent = 'Night';
        tag.classList.remove('day');
        tag.classList.add('night');
    } else {
        tag.textContent = 'Day';
        tag.classList.remove('night');
        tag.classList.add('day');
    }
}

function toggleDayNight() {
    manualNightOverride = !currentIsNight;
    setWeatherTheme(currentWeatherMain, manualNightOverride);
    showAudioStatus(`Theme switched to ${manualNightOverride ? 'Night' : 'Day'}`, true);
}


// Set dynamic city background
function setCityBackground(cityName) {
    const cityKey = cityName.toLowerCase().trim();
    const backgroundUrl = cityBackgrounds[cityKey] || cityBackgrounds['default'];

    // Create a smooth transition effect
    const body = document.body;
    body.style.transition = 'background-image 1.5s ease-in-out';

    // Set the background image with overlay
    body.style.backgroundImage = `
        linear-gradient(135deg, rgba(26, 26, 46, 0.85) 0%, rgba(22, 33, 62, 0.75) 50%, rgba(15, 52, 96, 0.85) 100%),
        url('${backgroundUrl}')
    `;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';

    // Add a subtle vignette effect
    if (!document.querySelector('.background-vignette')) {
        const vignette = document.createElement('div');
        vignette.className = 'background-vignette';
        vignette.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%);
            pointer-events: none;
            z-index: -1;
            transition: opacity 1s ease;
        `;
        document.body.appendChild(vignette);
    }
}

// Create enhanced weather animations
function createEnhancedWeatherAnimations(weatherType, isNight = false) {
    const container = document.getElementById('particles');
    container.innerHTML = '';

    const animationConfig = weatherAnimations[weatherType] || weatherAnimations.clear;
    const intensity = animationConfig.intensity;
    const colors = animationConfig.colors;

    switch (weatherType) {
        case 'clear':
            if (isNight) {
                createStars(30);
            } else {
                createSunRays(8);
                createSunFlare();
            }
            break;

        case 'clouds':
            createMovingClouds(5);
            break;

        case 'rain':
            createRainDrops(intensity === 'high' ? 80 : 50);
            createRainRipples();
            break;

        case 'drizzle':
            createRainDrops(30);
            createLightMist();
            break;

        case 'thunderstorm':
            createStormClouds(6);
            createLightningFlashes();
            createHeavyRain(100);
            break;

        case 'snow':
            createSnowflakes(70);
            createSnowDrift();
            break;

        case 'mist':
            createMistFog(15);
            break;
    }
}

// Create sun rays animation
function createSunRays(count) {
    const container = document.getElementById('particles');

    for (let i = 0; i < count; i++) {
        const ray = document.createElement('div');
        ray.className = 'sun-ray';
        ray.style.cssText = `
            position: absolute;
            width: 2px;
            height: 150px;
            background: linear-gradient(to bottom, rgba(255, 215, 0, 0.8), transparent);
            top: 10%;
            left: ${45 + Math.random() * 10}%;
            transform-origin: center top;
            transform: rotate(${i * (360 / count)}deg);
            animation: sunRayShine 4s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            opacity: 0.6;
        `;
        container.appendChild(ray);
    }
}

// Create sun flare effect
function createSunFlare() {
    const container = document.getElementById('particles');
    const flare = document.createElement('div');
    flare.className = 'sun-flare';
    flare.style.cssText = `
        position: absolute;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 182, 39, 0.2) 50%, transparent 70%);
        border-radius: 50%;
        top: 8%;
        left: 45%;
        animation: sunFlarePulse 6s ease-in-out infinite;
        pointer-events: none;
    `;
    container.appendChild(flare);
}

// Create moving clouds
function createMovingClouds(count) {
    const container = document.getElementById('particles');

    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'moving-cloud';
        cloud.style.cssText = `
            position: absolute;
            width: ${150 + Math.random() * 200}px;
            height: ${80 + Math.random() * 60}px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50px;
            top: ${10 + Math.random() * 30}%;
            left: -20%;
            animation: moveCloud ${20 + Math.random() * 15}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        `;

        // Add cloud puffs
        for (let j = 0; j < 3; j++) {
            const puff = document.createElement('div');
            puff.style.cssText = `
                position: absolute;
                width: ${40 + Math.random() * 30}px;
                height: ${40 + Math.random() * 30}px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                top: ${Math.random() * 40}px;
                left: ${j * 30 + Math.random() * 20}px;
            `;
            cloud.appendChild(puff);
        }

        container.appendChild(cloud);
    }
}

// Create rain drops
function createRainDrops(count) {
    const container = document.getElementById('particles');

    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.cssText = `
            position: absolute;
            width: 2px;
            height: ${15 + Math.random() * 25}px;
            background: linear-gradient(to bottom, transparent, rgba(52, 152, 219, 0.8));
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: rainFall ${0.5 + Math.random() * 1}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
            border-radius: 1px;
        `;
        container.appendChild(drop);
    }
}

// Create rain ripples
function createRainRipples() {
    const container = document.getElementById('particles');

    // Create ripple effects on the ground
    setInterval(() => {
        const ripple = document.createElement('div');
        ripple.className = 'rain-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(52, 152, 219, 0.4);
            border-radius: 50%;
            bottom: 0;
            left: ${Math.random() * 100}%;
            animation: rippleExpand 1s ease-out forwards;
        `;
        container.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
    }, 200);
}

// Create storm clouds
function createStormClouds(count) {
    const container = document.getElementById('particles');

    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'storm-cloud';
        cloud.style.cssText = `
            position: absolute;
            width: ${200 + Math.random() * 150}px;
            height: ${100 + Math.random() * 50}px;
            background: linear-gradient(to bottom, #2c3e50, #34495e);
            border-radius: 50px;
            top: ${5 + Math.random() * 20}%;
            left: ${Math.random() * 80}%;
            animation: driftCloud ${25 + Math.random() * 15}s linear infinite;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        `;
        container.appendChild(cloud);
    }
}

// Create lightning flashes
function createLightningFlashes() {
    const container = document.getElementById('particles');

    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            const flash = document.createElement('div');
            flash.className = 'lightning-flash';
            flash.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                animation: lightningFlash 0.1s ease-in-out;
                pointer-events: none;
                z-index: 1000;
            `;
            container.appendChild(flash);

            setTimeout(() => flash.remove(), 100);
        }
    }, 3000);
}

// Create snowflakes
function createSnowflakes(count) {
    const container = document.getElementById('particles');

    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.cssText = `
            position: absolute;
            width: ${4 + Math.random() * 8}px;
            height: ${4 + Math.random() * 8}px;
            background: white;
            border-radius: 50%;
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: snowFall ${3 + Math.random() * 4}s linear infinite;
            animation-delay: ${Math.random() * 3}s;
            box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
            opacity: 0.9;
        `;
        container.appendChild(flake);
    }
}

// Create stars for night sky
function createStars(count) {
    const container = document.getElementById('particles');

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 50}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        `;
        container.appendChild(star);
    }
}

// Create heavy rain for thunderstorms
function createHeavyRain(count) {
    const container = document.getElementById('particles');

    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'heavy-rain-drop';
        drop.style.cssText = `
            position: absolute;
            width: 3px;
            height: ${20 + Math.random() * 40}px;
            background: linear-gradient(to bottom, transparent, rgba(74, 144, 226, 0.9), rgba(52, 152, 219, 0.8));
            top: -20px;
            left: ${Math.random() * 100}%;
            animation: heavyRainFall ${0.3 + Math.random() * 0.5}s linear infinite;
            animation-delay: ${Math.random() * 1}s;
            border-radius: 2px;
            box-shadow: 0 0 2px rgba(74, 144, 226, 0.5);
        `;
        container.appendChild(drop);
    }
}

// Create snow drift effect
function createSnowDrift() {
    const container = document.getElementById('particles');

    // Add ground accumulation effect
    const snowGround = document.createElement('div');
    snowGround.className = 'snow-ground';
    snowGround.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent);
        pointer-events: none;
        animation: snowAccumulate 30s ease-in-out infinite;
    `;
    container.appendChild(snowGround);
}

// Create light mist effect
function createLightMist() {
    const container = document.getElementById('particles');

    for (let i = 0; i < 8; i++) {
        const mist = document.createElement('div');
        mist.className = 'light-mist';
        mist.style.cssText = `
            position: absolute;
            width: ${200 + Math.random() * 300}px;
            height: ${100 + Math.random() * 150}px;
            background: radial-gradient(ellipse, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
            border-radius: 50%;
            top: ${Math.random() * 60}%;
            left: ${Math.random() * 100}%;
            animation: lightMistDrift ${25 + Math.random() * 20}s linear infinite;
            animation-delay: ${Math.random() * 15}s;
        `;
        container.appendChild(mist);
    }
}

// Award XP and check level up
function awardXP(amount) {
    userStats.xp += amount;
    const xpForNextLevel = userStats.level * 100;
    if (userStats.xp >= xpForNextLevel) {
        userStats.level++;
        showLevelUp();
    }
    updateUI();
    saveUserStats();
}

// Show level up animation
function showLevelUp() {
    const levelUp = document.createElement('div');
    levelUp.textContent = `🎉 LEVEL UP! Now Level ${userStats.level} 🎉`;
    levelUp.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ffd700, #ffed4e);
        color: black;
        padding: 20px 40px;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 1000;
        animation: levelUpPop 0.8s ease-out;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    `;
    document.body.appendChild(levelUp);

    setTimeout(() => {
        levelUp.remove();
    }, 3000);
}

// Update streak
function updateStreak() {
    const today = new Date().toDateString();
    if (userStats.lastCheckDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (userStats.lastCheckDate === yesterday.toDateString()) {
        userStats.streak++;
    } else {
        userStats.streak = 1;
    }

    userStats.lastCheckDate = today;
    awardXP(10); // XP for daily check
}

// Check and unlock achievements
function checkAchievements(weatherData) {
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const city = weatherData.name;

    // First check achievement
    if (!userStats.achievements.has('first-check')) {
        unlockAchievement('first-check');
    }

    // Weather type achievements
    if (weatherMain === 'clear' && !userStats.achievements.has('sunny-day')) {
        unlockAchievement('sunny-day');
    }
    if ((weatherMain === 'rain' || weatherMain === 'drizzle') && !userStats.achievements.has('rainy-day')) {
        unlockAchievement('rainy-day');
    }
    if (weatherMain === 'snow' && !userStats.achievements.has('snowy-day')) {
        unlockAchievement('snowy-day');
    }

    // Streak achievement
    if (userStats.streak >= 7 && !userStats.achievements.has('streak-7')) {
        unlockAchievement('streak-7');
    }

    // City explorer achievement
    userStats.citiesChecked.add(city);
    if (userStats.citiesChecked.size >= 5 && !userStats.achievements.has('explorer')) {
        unlockAchievement('explorer');
    }

    userStats.weatherTypes.add(weatherMain);
    saveUserStats();
}

// Unlock achievement
function unlockAchievement(id) {
    userStats.achievements.add(id);
    const achievementEl = document.getElementById(id);
    if (achievementEl) {
        achievementEl.classList.remove('locked');
        achievementEl.classList.add('unlocked');
    }

    // Show unlock notification
    showAchievementUnlock(id);
    awardXP(50); // XP for unlocking achievement
}

// Show achievement unlock notification
function showAchievementUnlock(id) {
    const achievement = achievements[id];
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 2rem;">${achievement.icon}</span>
            <div>
                <div style="font-weight: bold;">Achievement Unlocked!</div>
                <div>${achievement.name}</div>
            </div>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ffd700, #ffed4e);
        color: black;
        padding: 15px 20px;
        border-radius: 15px;
        font-size: 1rem;
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        max-width: 300px;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Update achievements display
function updateAchievements() {
    Object.keys(achievements).forEach(id => {
        const el = document.getElementById(id);
        if (userStats.achievements.has(id)) {
            el.classList.remove('locked');
            el.classList.add('unlocked');
        }
    });
}

// Main weather fetching function
async function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        showError('Please enter a city name!');
        return;
    }

    const button = document.getElementById('search-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="btn-text">🔄 Loading...</span>';
    button.disabled = true;

    try {
        // Get current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const currentResponse = await fetch(currentWeatherUrl);
        const currentData = await currentResponse.json();

        if (currentData.cod === '404') {
            throw new Error('City not found');
        }

        // Get 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Update streak and achievements
        updateStreak();
        checkAchievements(currentData);

        // Set weather theme
        const isNight = currentData.dt > currentData.sys.sunset || currentData.dt < currentData.sys.sunrise;
        manualNightOverride = null; // reset manual toggle when new city is loaded
        setWeatherTheme(currentData.weather[0].main, isNight);

        // Set dynamic city background
        setCityBackground(currentData.name);

        // Update background map location
        updateMapLocation(currentData.coord.lat, currentData.coord.lon, currentData.name);

        // Display weather data
        displayWeather(currentData);
        displayForecast(forecastData);

        // Award XP for successful weather check
        awardXP(20);

    } catch (error) {
        showError(error.message === 'City not found' ? 'City not found. Try again!' : 'Something went wrong. Try again!');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;

        // Resume background audio if enabled (user gesture already occurred)
        if (audioEnabled && bgAudio && bgAudio.paused) {
            bgAudio.play().catch(() => {
                // ignore autoplay errors, user can toggle audio manually
            });
        }
    }
}

// Display current weather
function displayWeather(data) {
    const icon = weatherIcons[data.weather[0].description.toLowerCase()] || '🌤️';
    const isFavorite = userStats.favorites.some(fav => fav.name === data.name);

    document.getElementById('result').innerHTML = `
        <div class="weather-card">
            <div class="weather-icon">${icon}</div>
            <div class="city-name">
                <span>📍</span>
                <span>${data.name}, ${data.sys.country}</span>
                <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" 
                        onclick="toggleFavorite('${data.name.replace(/'/g, "\\'")}', ${JSON.stringify(data).replace(/"/g, '&quot;')})"
                        title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <div class="description">${data.weather[0].description}</div>
            <div class="details">
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">💧 ${data.main.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind</span>
                    <span class="detail-value">💨 ${data.wind.speed} m/s</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Feels Like</span>
                    <span class="detail-value">🌡️ ${Math.round(data.main.feels_like)}°C</span>
                </div>
            </div>
        </div>
    `;
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    const forecastGrid = document.getElementById('forecast-grid');

    // Group forecast by day
    const dailyForecast = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecast[date]) {
            dailyForecast[date] = item;
        }
    });

    forecastGrid.innerHTML = Object.entries(dailyForecast).slice(0, 5).map(([date, item]) => {
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        const icon = weatherIcons[item.weather[0].description.toLowerCase()] || '🌤️';

        return `
            <div class="forecast-item">
                <div class="forecast-date">${dayName}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
                <div class="forecast-desc">${item.weather[0].description}</div>
            </div>
        `;
    }).join('');

    forecastContainer.style.display = 'block';
    
    // Show trivia after forecast
    setTimeout(() => showTrivia(), 1000);
}

// Show weather trivia
function showTrivia() {
    const triviaContainer = document.getElementById('trivia-container');
    currentTrivia = weatherTrivia[Math.floor(Math.random() * weatherTrivia.length)];
    
    document.getElementById('trivia-question').textContent = currentTrivia.question;
    
    const optionsHtml = currentTrivia.options.map((option, index) => 
        `<div class="trivia-option" onclick="checkTriviaAnswer(${index})">${option}</div>`
    ).join('');
    
    document.getElementById('trivia-options').innerHTML = optionsHtml;
    document.getElementById('trivia-result').style.display = 'none';
    
    triviaContainer.style.display = 'block';
    triviaContainer.scrollIntoView({ behavior: 'smooth' });
}

// Check trivia answer
function checkTriviaAnswer(selectedIndex) {
    const options = document.querySelectorAll('.trivia-option');
    const resultDiv = document.getElementById('trivia-result');
    
    options.forEach((option, index) => {
        if (index === currentTrivia.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
        option.onclick = null; // Disable further clicks
    });
    
    if (selectedIndex === currentTrivia.correct) {
        resultDiv.innerHTML = `<div class="trivia-result correct">🎉 Correct! +25 XP</div><div style="margin-top: 10px; font-size: 0.9rem; opacity: 0.8;">${currentTrivia.fact}</div>`;
        awardXP(25);
    } else {
        resultDiv.innerHTML = `<div class="trivia-result incorrect">❌ Incorrect! The correct answer was: ${currentTrivia.options[currentTrivia.correct]}</div><div style="margin-top: 10px; font-size: 0.9rem; opacity: 0.8;">${currentTrivia.fact}</div>`;
    }
    
    resultDiv.style.display = 'block';
    
    // Hide trivia after 5 seconds and show new one
    setTimeout(() => {
        document.getElementById('trivia-container').style.display = 'none';
    }, 5000);
}

// Show error message
function showError(message) {
    document.getElementById('result').innerHTML = `<p class="error">${message}</p>`;
    document.getElementById('forecast-container').style.display = 'none';
}

// Toggle favorite status
function toggleFavorite(cityName, cityData) {
    const isFavorite = userStats.favorites.some(fav => fav.name === cityName);
    
    if (isFavorite) {
        removeFromFavorites(cityName);
    } else {
        addToFavorites(cityData);
    }
    
    // Update the button immediately
    const button = event.target;
    button.classList.toggle('favorited');
    button.textContent = button.classList.contains('favorited') ? '❤️' : '🤍';
    button.title = button.classList.contains('favorited') ? 'Remove from favorites' : 'Add to favorites';
}

// Add city to favorites
function addToFavorites(cityData) {
    const cityName = cityData.name;
    const existingIndex = userStats.favorites.findIndex(fav => fav.name === cityName);
    
    if (existingIndex === -1) {
        userStats.favorites.push({
            name: cityName,
            country: cityData.sys.country,
            temp: Math.round(cityData.main.temp),
            weather: cityData.weather[0].description,
            icon: weatherIcons[cityData.weather[0].description.toLowerCase()] || '🌤️'
        });
        saveUserStats();
        showNotification(`❤️ Added ${cityName} to favorites!`);
    } else {
        showNotification(`${cityName} is already in favorites!`);
    }
}

// Remove city from favorites
function removeFromFavorites(cityName) {
    userStats.favorites = userStats.favorites.filter(fav => fav.name !== cityName);
    saveUserStats();
    displayFavorites();
    showNotification(`💔 Removed ${cityName} from favorites`);
}

// Display favorites
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    
    if (userStats.favorites.length === 0) {
        favoritesList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No favorite cities yet. Click the heart after checking weather!</p>';
        return;
    }
    
    favoritesList.innerHTML = userStats.favorites.map(fav => `
        <div class="favorite-city" onclick="getWeatherForCity('${fav.name}')">
            <div class="favorite-city-info">
                <div class="favorite-city-name">${fav.icon} ${fav.name}, ${fav.country}</div>
                <div class="favorite-city-temp">${fav.temp}°C - ${fav.weather}</div>
            </div>
            <div class="remove-favorite" onclick="event.stopPropagation(); removeFromFavorites('${fav.name}')" title="Remove from favorites">×</div>
        </div>
    `).join('');
}

// Get weather for favorite city
function getWeatherForCity(cityName) {
    document.getElementById('city').value = cityName;
    getWeather();
    toggleFavorites(); // Hide favorites panel
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 0.9rem;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add some CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    @keyframes levelUpPop {
        0% { transform: translate(-50%, -50%) scale(0); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===========================================
// PROFESSIONAL ENTERPRISE FEATURES
// ===========================================

// Footer Statistics
let searchCount = 0;
let activeUsers = Math.floor(Math.random() * 50) + 10; // Simulated active users

function updateFooterStats() {
    searchCount++;
    document.getElementById('total-searches').textContent = searchCount;

    // Simulate active users fluctuation
    activeUsers += Math.floor(Math.random() * 5) - 2;
    activeUsers = Math.max(5, Math.min(100, activeUsers));
    document.getElementById('active-users').textContent = activeUsers;
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners for Modals
document.addEventListener('DOMContentLoaded', () => {
    // Footer link handlers
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            if (href === '#about') {
                openModal('about-modal');
            } else if (href === '#contact') {
                openModal('contact-modal');
            } else if (href === '#features') {
                // Scroll to features section (weather cards)
                document.querySelector('.weather-cards')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else if (href === '#privacy' || href === '#terms') {
                // Show placeholder for legal pages
                showError('Legal pages coming soon! 📋');
            }
        });
    });

    // Modal close handlers
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Contact form handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };

            // Simulate form submission
            showSuccess('Message sent successfully! 📧 I\'ll get back to you soon.');

            // Reset form
            contactForm.reset();

            // Close modal after delay
            setTimeout(() => {
                closeModal('contact-modal');
            }, 2000);
        });
    }

    // Initialize footer stats
    updateFooterStats();
});

// Enhanced success/error messages with animations
function showSuccess(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Override existing showError to use new notification system
const originalShowError = window.showError;
window.showError = function(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">❌</span>
            <span class="notification-text">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
};

// Enhanced weather search to update footer stats
const originalGetWeather = window.getWeather;
window.getWeather = function() {
    updateFooterStats();
    return originalGetWeather.apply(this, arguments);
};

// Professional loading states
function showProfessionalLoader() {
    const loader = document.createElement('div');
    loader.className = 'professional-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner">
                <div class="weather-loading-icon"></div>
            </div>
            <div class="loader-text">Loading AtmosFlow...</div>
        </div>
    `;
    document.body.appendChild(loader);

    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 500);
    }, 2000);
}

// Background audio (lofi / ambiance)
let bgAudio = null;
let audioEnabled = false;
const backgroundAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

function initializeBackgroundAudio() {
    bgAudio = new Audio(backgroundAudioUrl);
    bgAudio.crossOrigin = 'anonymous';
    bgAudio.loop = true;
    bgAudio.volume = 0.18;
    bgAudio.preload = 'auto';

    audioEnabled = localStorage.getItem('atmosflowBgAudio') === 'true';
    updateAudioButton();

    if (audioEnabled) {
        // Attempt to autoplay (may require user interaction)
        bgAudio.play().catch(() => {
            showError('Tap the audio button to enable sound.');
        });
    }
}

function showAudioStatus(message, isOn) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${isOn ? 'success-notification' : 'error-notification'}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${isOn ? '✅' : '🔇'}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function toggleAudio() {
    audioEnabled = !audioEnabled;
    localStorage.setItem('atmosflowBgAudio', audioEnabled ? 'true' : 'false');

    if (audioEnabled) {
        bgAudio.play().catch(() => {
            showAudioStatus('Tap the audio button to enable sound.', false);
        });
        showAudioStatus('Background music enabled 🎶', true);
    } else {
        bgAudio.pause();
        showAudioStatus('Background music muted 🔇', false);
    }

    updateAudioButton();
}

function updateAudioButton() {
    const btn = document.getElementById('audio-toggle-btn');
    if (!btn) return;

    if (audioEnabled) {
        btn.classList.add('active');
        btn.textContent = '🔊';
        btn.title = 'Mute background music';
    } else {
        btn.classList.remove('active');
        btn.textContent = '🔇';
        btn.title = 'Play background music';
    }
}

// Initialize professional features on page load
document.addEventListener('DOMContentLoaded', () => {
    // Show professional loader on initial load
    showProfessionalLoader();

    // Initialize background audio (lofi ambiance)
    initializeBackgroundAudio();

    // Make day/night tag clickable
    const dayNightTag = document.getElementById('day-night-tag');
    if (dayNightTag) {
        dayNightTag.style.cursor = 'pointer';
        dayNightTag.addEventListener('click', () => {
            toggleDayNight();
        });
        updateDayNightTag(false);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('city').focus();
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal[style*="display: block"]').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // Add performance monitoring
    if ('performance' in window && 'timing' in performance) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`🚀 AtmosFlow loaded in ${loadTime}ms`);
        });
    }
});

// Export functions for potential API usage
window.AtmosFlow = {
    getWeather,
    updateMapLocation,
    openModal,
    closeModal,
    showSuccess,
    showError
};