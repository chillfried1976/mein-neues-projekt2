// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherResult = document.getElementById('weatherResult');

    // Add event listener for the search button
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            getWeatherData(city);
        } else {
            alert('Bitte gib einen Ort ein.');
        }
    });

    /**
     * Fetches weather data from a public API and updates the UI.
     * This is an example using the Open-Meteo API, which doesn't require an API key.
     * 
     * @param {string} city - The city to get weather data for.
     */
    async function getWeatherData(city) {
        // First, we need to get the latitude and longitude for the city
        // We can use a free geocoding API for that.
        const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`;

        try {
            weatherResult.innerHTML = '<p>Lade Wetterdaten...</p>';

            const geoResponse = await fetch(geocodingUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                weatherResult.innerHTML = `<div class="alert alert-danger">Ort nicht gefunden.</div>`;
                return;
            }

            const location = geoData.results[0];
            const { latitude, longitude, name, admin1 } = location;

            // Now, get the weather for the found coordinates
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const { temperature, windspeed, weathercode } = weatherData.current_weather;

            // Display the result
            weatherResult.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Wetter in ${name}${admin1 ? ', ' + admin1 : ''}</h5>
                        <p class="card-text">Temperatur: ${temperature}°C</p>
                        <p class="card-text">Windgeschwindigkeit: ${windspeed} km/h</p>
                        <p class="card-text">Wettercode: ${weathercode} (Hier könnte man ein Icon anzeigen)</p>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
            weatherResult.innerHTML = `<div class="alert alert-danger">Ein Fehler ist aufgetreten.</div>`;
        }
    }
});
