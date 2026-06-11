const apiKey = '8977595c1a1f45248a3213230260906'; 
const searchBtn = document.getElementById('search-btn');
const gpsBtn = document.getElementById('gps-btn');
const searchInput = document.getElementById('search-input');
const tempEl = document.getElementById('temp');
const locationEl = document.getElementById('location');
const dateTimeEl = document.getElementById('date-time');
const descEl = document.getElementById('weather-desc');
const iconEl = document.getElementById('weather-icon');

async function fetchWeather(query) {
    if (!query) return;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}&aqi=no`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Location not found. Please try again.');
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error(error);
        locationEl.textContent = "Error Loading Data";
        alert(error.message + " Make sure your API key is pasted correctly inside script.js");
    }
}
function updateUI(data) {
    locationEl.textContent = `${data.location.name}, ${data.location.country}`;
    tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;
    descEl.textContent = data.current.condition.text;
    iconEl.src = `https:${data.current.condition.icon}`;
    iconEl.style.display = "block";
    const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    dateTimeEl.textContent = new Date().toLocaleDateString('en-US', options);
}
function autoLocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = `${position.coords.latitude},${position.coords.longitude}`;
                fetchWeather(coords);
            },
            () => {
                fetchWeather("Dhaka");
            }
        );
    } else {
        fetchWeather("Dhaka");
    }
}
searchBtn.addEventListener('click', () => fetchWeather(searchInput.value.trim()));
gpsBtn.addEventListener('click', autoLocate);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather(searchInput.value.trim());
});