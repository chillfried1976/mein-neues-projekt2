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
     * Maps WMO weather codes to a description and an icon.
     * @param {number} code - The WMO weather code.
     * @returns {{description: string, icon: string}}
     */
    function getWeatherInfo(code) {
        const weatherMap = {
            0: { description: 'Klarer Himmel', icon: '☀️' },
            1: { description: 'Teilweise bewölkt', icon: '🌤️' },
            2: { description: 'Bedeckt', icon: '☁️' },
            3: { description: 'Stark bewölkt', icon: '🌥️' },
            45: { description: 'Nebel', icon: '🌫️' },
            48: { description: 'Reifnebel', icon: '🌫️' },
            51: { description: 'Leichter Nieselregen', icon: '🌦️' },
            53: { description: 'Mäßiger Nieselregen', icon: '🌦️' },
            55: { description: 'Starker Nieselregen', icon: '🌦️' },
            56: { description: 'Gefrierender Nieselregen', icon: '🥶' },
            57: { description: 'Dichter gefrierender Nieselregen', icon: '🥶' },
            61: { description: 'Leichter Regen', icon: '🌧️' },
            63: { description: 'Mäßiger Regen', icon: '🌧️' },
            65: { description: 'Starker Regen', icon: '🌧️' },
            66: { description: 'Gefrierender Regen', icon: '🌨️' },
            67: { description: 'Starker gefrierender Regen', icon: '🌨️' },
            71: { description: 'Leichter Schneefall', icon: '❄️' },
            73: { description: 'Mäßiger Schneefall', icon: '❄️' },
            75: { description: 'Starker Schneefall', icon: '❄️' },
            77: { description: 'Schneekörner', icon: '❄️' },
            80: { description: 'Leichte Regenschauer', icon: '🌧️' },
            81: { description: 'Mäßige Regenschauer', icon: '🌧️' },
            82: { description: 'Starke Regenschauer', icon: '🌧️' },
            85: { description: 'Leichte Schneeschauer', icon: '❄️' },
            86: { description: 'Starke Schneeschauer', icon: '❄️' },
            95: { description: 'Gewitter', icon: '⛈️' },
            96: { description: 'Gewitter mit leichtem Hagel', icon: '⛈️' },
            99: { description: 'Gewitter mit starkem Hagel', icon: '⛈️' },
        };
        return weatherMap[code] || { description: 'Unbekannt', icon: '🤷' };
    }

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
                weatherResult.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Ort nicht gefunden.</div>`;
                return;
            }

            const location = geoData.results[0];
            const { latitude, longitude, name, admin1 } = location;

            // Now, get the weather for the found coordinates
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const { temperature, windspeed, weathercode } = weatherData.current_weather;
            const weatherInfo = getWeatherInfo(weathercode);

            // Display the result
            weatherResult.innerHTML = `
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h2 class="text-2xl font-bold mb-2">Wetter in ${name}${admin1 ? ', ' + admin1 : ''}</h2>
                    <div class="flex items-center">
                        <span class="text-5xl mr-4">${weatherInfo.icon}</span>
                        <div>
                            <p class="text-gray-700 text-lg">${weatherInfo.description}</p>
                            <p class="text-gray-700">Temperatur: ${temperature}°C</p>
                            <p class="text-gray-700">Windgeschwindigkeit: ${windspeed} km/h</p>
                        </div>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
            weatherResult.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Ein Fehler ist aufgetreten.</div>`;
        }
    }
});
