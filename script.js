const apiKey = '673079df600a38f8c949a91390672ff1';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';


const weatherBackgrounds = {
    sunny: 'images/sunny.jpg',
    snowy: 'images/snowy.jpg',
    rainy: 'images/rainy.jpg',
    cloudy: 'images/cloudy.jpg',
    
};

document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeather(city);
        fetchForecast(city);
    } else {
        alert('Please enter a city name');
    }
});

async function fetchWeather(city) {
    try {
        toggleSpinner(true);
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
        changeBackground(data); 
    } catch (error) {
        alert(error.message);
    } finally {
        toggleSpinner(false);
    }
}

async function fetchForecast(city) {
    try {
        const response = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherDisplay.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <img src="${weatherIcon}" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
    `;
}

function displayForecast(data) {
    const forecastDisplay = document.getElementById('forecast-display');
    forecastDisplay.innerHTML = '<h2>5-Day Forecast</h2>';
    let date = new Date();
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);
    dailyForecasts.slice(0, 5).forEach(item => {
        date.setDate(date.getDate() + 1);
    
        const forecastDate = new Date(item.dt * 1000);
        const weatherIcon = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        forecastDisplay.innerHTML += `
                <p>${date.toDateString()}: ${item.main.temp}°C, ${item.weather[0].description}</p><img src="${weatherIcon}" alt="${item.weather[0].description}">
        `;
    });
}


function toggleSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.toggle('hidden', !show);
}

function changeBackground(data) {
    const body = document.body;
    let backgroundUrl = 'images/default.jpg'; // changed the pexel image name
// if statements to check the results and like change it 
    if (data.main.temp > 22) {
        backgroundUrl = weatherBackgrounds.sunny;
    } else if (data.main.temp < 10) {
        backgroundUrl = weatherBackgrounds.snowy;
    } else if (data.main.temp < 22) {
        backgroundUrl = weatherBackgrounds.cloudy;
    } else if (data.weather[0].main.toLowerCase().includes('rain')) { // it's different here cause i cant think of a temo for rain and cloud
        backgroundUrl = weatherBackgrounds.rainy;
    } else if (data.weather[0].main.toLowerCase().includes('clouds')) {
        backgroundUrl = weatherBackgrounds.cloudy;
    }

    body.style.backgroundImage = `url('${backgroundUrl}')`;

    // to test code (ignore this)
    const img = new Image();
    img.src = backgroundUrl;
    img.onload = () => console.log(`Image loaded: ${backgroundUrl}`);
    img.onerror = () => console.error(`Image failed to load: ${backgroundUrl}`);
}

