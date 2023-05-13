var tableBody = document.getElementById('forecast');
var city = document.getElementById('city');
var state = document.getElementById('state');
var lat
var long
var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=efc57a7623532e34f2cd174588ac46a8`;
const weatherUrl = `http://api.openweathermap.org/data/3.0/onecall?lat=32.7767&lon=-96.7970&appid=efc57a7623532e34f2cd174588ac46a8&units=imperial`;


async function getWeatherForecast() {
    const response = await fetch(weatherUrl);
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  }

  function displayWeather(data){
    const weatherData = data.daily;
    const tableDate = document.getElementById('weatherDate');
    const tableTemp = document.getElementById('weatherTemp');
    const tableHumid = document.getElementById('weatherHumid');
    const tableWindSpeed = document.getElementById('weatherWindSpeed');
    const tableCondition = document.getElementById('weatherCondition');
    let i=0;
    for(const day of weatherData){
        i++;
        const listEl = document.createElement('td');
        let maxTemp = Math.trunc(day.temp.max);
        let minTemp = Math.trunc(day.temp.min);
        let dayOfWeek = dayjs(day.dt*1000).format('ddd, MMM DD');
        let weatherDate = document.createElement('td');
        let weatherTemp = document.createElement('td');
        let weatherHumid = document.createElement('td');
        let weatherWindSpeed = document.createElement('td');
        let weatherCondition = document.createElement('td');
        weatherDate.textContent = `${dayOfWeek}`;
        weatherTemp.textContent = `${maxTemp}°F/${minTemp}°F`;
        weatherHumid.textContent = `Humidity: ${day.humidity}%`;
        weatherWindSpeed.textContent = `Wind Speed: ${day.wind_speed}mph`;
        weatherCondition.textContent = `(${day.weather[0].description})`;
        // listEl.textContent = `${dayOfWeek} ${maxTemp}°F/${minTemp}°F Humidity: ${day.humidity}% Wind Speed: ${day.wind_speed}mph (${day.weather[0].description}) `;
        listEl.style.backgroundImage = `url(https://openweathermap.org/img/wn/${day.weather[0].icon}.png)`;
        listEl.style.backgroundSize = `cover`;
        tableDate.appendChild(weatherDate);
        tableTemp.appendChild(weatherTemp);
        tableHumid.appendChild(weatherHumid);
        tableWindSpeed.appendChild(weatherWindSpeed);
        tableCondition.appendChild(weatherCondition);
        // tableRow.appendChild(listEl);
        if(i>4){
            break;
        }
    }
  }

  async function getLocation(){
    const response = await fetch(locationUrl);
    const data = await response.json();
    console.log(data);
    const cityState = document.getElementById('cityState');
    var place = document.createElement('td');
    place.innerText = `${data[0].name}, ${data[0].state} `;
    cityState.appendChild(place);
    // city.innerHTML = data[0].name;
    // state.outerText = data[0].state;
    console.log(data[0].name);
  }
  
  getWeatherForecast();
  getLocation();
