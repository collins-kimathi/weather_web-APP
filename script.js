//making object of weatherapi
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

//anonymous function
//adding event listener key press of enter
let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
    }
})

//get weather report
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => {
            return weather.json();
        }).then(showWeatherReport);
}

//show weather report
function showWeatherReport(weather) {
    let city_code = weather.cod;
    
    if (city_code === '400') { 
        swal("Empty Input", "Please enter any city", "error");
        reset();
    } else if (city_code === '404') {
        swal("Bad Input", "Entered city didn't match", "warning");
        reset();
    } else {
        // Call the new displayWeather function
        displayWeather(weather);
    }
}

// Display weather function - improved version
function displayWeather(weather) {
    // Validate weather data
    if (!weather || !weather.main || !weather.weather || !weather.weather[0]) {
        console.error('Invalid weather data');
        return;
    }

    try {
        // Cache DOM elements
        const weatherBody = document.getElementById('weather-body');
        
        // Show weather section
        weatherBody.style.display = 'block';
        
        // Get current date
        const todayDate = new Date();
        
        // Build HTML content
        weatherBody.innerHTML = buildWeatherHTML(weather, todayDate);
        
        // Apply background and reset
        changeBg(weather.weather[0].main);
        reset();
        
    } catch (error) {
        console.error('Error displaying weather:', error);
    }
}

// Build complete weather HTML
function buildWeatherHTML(weather, date) {
    return `
        ${buildLocationHTML(weather, date)}
        ${buildStatusHTML(weather, date)}
        <hr>
        ${buildDetailsHTML(weather)}
    `;
}

// Build location section
function buildLocationHTML(weather, date) {
    return `
        <div class="location-details">
            <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date" id="date">${dateManage(date)}</div>
        </div>
    `;
}

// Build weather status section
function buildStatusHTML(weather, date) {
    const temp = Math.round(weather.main.temp);
    const tempMin = Math.floor(weather.main.temp_min);
    const tempMax = Math.ceil(weather.main.temp_max);
    const weatherMain = weather.weather[0].main;
    
    return `
        <div class="weather-status">
            <div class="temp" id="temp">${temp}&deg;C</div>
            <div class="weather" id="weather">
                ${weatherMain} <i class="${getIconClass(weatherMain)}"></i>
            </div>
            <div class="min-max" id="min-max">
                ${tempMin}&deg;C (min) / ${tempMax}&deg;C (max)
            </div>
            <div id="updated_on">Updated as of ${getTime(date)}</div>
        </div>
    `;
}

// Build details section
function buildDetailsHTML(weather) {
    const feelsLike = Math.round(weather.main.feels_like);
    const humidity = weather.main.humidity;
    const pressure = weather.main.pressure;
    const windSpeed = weather.wind.speed;
    
    return `
        <div class="day-details">
            <div class="basic">
                Feels like ${feelsLike}&deg;C | Humidity ${humidity}%
                <br>
                Pressure ${pressure} mb | Wind ${windSpeed} KMPH
            </div>
        </div>
    `;
}

//making a function for the last update current time 
function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

//date manage for return current date
function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    
    return `${date} ${month} (${day}), ${year}`;
}

// function for the dynamic background change according to weather status
function changeBg(status) {
    if (status === 'Clouds') {
        document.body.style.backgroundImage = 'url(img/clouds.jpg)';
    } else if (status === 'Rain') {
        document.body.style.backgroundImage = 'url(img/rainy.jpg)';
    } else if (status === 'Clear') {
        document.body.style.backgroundImage = 'url(img/clear.jpg)';
    } else if (status === 'Snow') {
        document.body.style.backgroundImage = 'url(img/snow.jpg)';
    } else if (status === 'Sunny') {
        document.body.style.backgroundImage = 'url(img/sunny.jpg)';
    } else if (status === 'Thunderstorm') {
        document.body.style.backgroundImage = 'url(img/thunderstrom.jpg)';
    } else if (status === 'Drizzle') {
        document.body.style.backgroundImage = 'url(img/drizzle.jpg)';
    } else if (status === 'Mist' || status === 'Haze' || status === 'Fog') {
        document.body.style.backgroundImage = 'url(img/mist.jpg)';
    } else {
        document.body.style.backgroundImage = 'url(img/bg.jpg)';
    }
}

//making a function for the classname of icon
function getIconClass(classarg) {
    if (classarg === 'Rain') {
        return 'fas fa-cloud-showers-heavy';
    } else if (classarg === 'Clouds') {
        return 'fas fa-cloud';
    } else if (classarg === 'Clear') {
        return 'fas fa-cloud-sun';
    } else if (classarg === 'Snow') {
        return 'fas fa-snowman';
    } else if (classarg === 'Sunny') {
        return 'fas fa-sun';
    } else if (classarg === 'Mist') {
        return 'fas fa-smog';
    } else if (classarg === 'Thunderstorm' || classarg === 'Drizzle') {
        return 'fas fa-thunderstorm';
    } else {
        return 'fas fa-cloud-sun';
    }
}

function reset() {
    let input = document.getElementById('input-box');
    input.value = "";
}

// function to add zero if hour and minute less than 10
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}