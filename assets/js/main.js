var tableBody = document.getElementById('forecast');
const url = 'api.openweathermap.org/data/2.5/forecast?lat=40.7608"&"lon=111.8910"&"appid=7f2216910666d11f868ca16931b05108';

const requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=32.7767&lon=-96.7970&cnt=5&appid=7f2216910666d11f868ca16931b05108&units=imperial';

// const requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=99076e40264606125b93f3c14a6a30b6';


async function getWeatherForecast() {
    const response = await fetch(requestUrl);
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  }

  function displayWeather(data){
    const weatherData = data.list;
    const tableRow = document.getElementById('tableData');
    for(const day of weatherData){
        const listEl = document.createElement('td');
        listEl.textContent = `${day.dt_txt}: ${day.main.temp} (${day.weather[0].description})`;
        listEl.style.backgroundImage = `url(https://openweathermap.org/img/wn/${day.weather[0].icon}.png)`;
        tableRow.appendChild(listEl);
    }
  }
  
  getWeatherForecast();
  



// getApi()
//     .then(displayData)
//     .catch(onError);