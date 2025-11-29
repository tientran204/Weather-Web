let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

const APP_ID = 'f0e584c99a42d87a5bd778b7085a27d8';
const DEFAULT_VALUE = '__';

const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperture = document.querySelector('.temperture');

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}&units=metric&lang=vi`)
    .then(async res => {
      const data = await res.json();
      console.log('[Weather Data]', data);

      if (data.cod === "404") {
        cityName.innerHTML = "Không tìm thấy";
        return;
      }

      cityName.innerHTML = data.name || DEFAULT_VALUE;
      weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      temperture.innerHTML = Math.round(data.main.temp);
      saveRecentSearch(data.name);
      sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm');
      sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm');
      humidity.innerHTML = data.main.humidity;
      windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2);

      updateThemeByCity(data);

      updateTimeIcon(data);
    })
    .catch(err => {
      console.error('Lỗi:', err);

      cityName.innerHTML = DEFAULT_VALUE;
      weatherState.innerHTML = DEFAULT_VALUE;
      temperture.innerHTML = DEFAULT_VALUE;
      sunrise.innerHTML = DEFAULT_VALUE;
      sunset.innerHTML = DEFAULT_VALUE;
      humidity.innerHTML = DEFAULT_VALUE;
      windSpeed.innerHTML = DEFAULT_VALUE;
    });
}

function updateThemeByCity(data) {
  const container = document.querySelector('.container');

  const current = data.dt;           
  const sunriseTime = data.sys.sunrise;
  const sunsetTime = data.sys.sunset;

  if (current >= sunriseTime && current < sunsetTime) {
    container.classList.remove('night-theme');
    container.classList.add('day-theme');
  } else {
    container.classList.remove('day-theme');
    container.classList.add('night-theme');
  }
}

function updateTimeIcon(data) {
  const current = data.dt;
  const sunriseTime = data.sys.sunrise;
  const sunsetTime = data.sys.sunset;
  const icon = document.querySelector('.time-icon');

  if (current >= sunriseTime && current < sunsetTime) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

searchInput.addEventListener('change', (e) => {
  fetchWeather(e.target.value);
});

document.querySelector('.search-bar i').addEventListener('click', () => {
  fetchWeather(searchInput.value);
});
fetchWeather("Ho Chi Minh");

function saveRecentSearch(city) {
    city = city.trim();

    if (!city) return;

    recentSearches = recentSearches.filter(item => item.toLowerCase() !== city.toLowerCase());

    recentSearches.unshift(city);

    if (recentSearches.length > 5) {
        recentSearches.pop();
    }

    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function displayRecentSearches() {
    const box = document.querySelector('.recent-search-box');
    box.innerHTML = "";

    recentSearches.forEach(city => {
        const item = document.createElement("div");
        item.classList.add("recent-item");
        item.innerText = city;

        item.onclick = () => {
            fetchWeather(city);
            searchInput.value = city;
        };

        box.appendChild(item);
    });
}
