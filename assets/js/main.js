var tableBody = document.getElementById('forecast');

// const url = 'api.openweathermap.org/data/2.5/forecast?lat=40.7608"&"lon=111.8910"&"appid=7f2216910666d11f868ca16931b05108';

const weatherUrl = `http://api.openweathermap.org/data/3.0/onecall?lat=32.7767&lon=-96.7970&appid=efc57a7623532e34f2cd174588ac46a8&units=imperial`;

// const requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=99076e40264606125b93f3c14a6a30b6';


async function getWeatherForecast() {
    const response = await fetch(weatherUrl);
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  }

  function displayWeather(data){
    const weatherData = data.daily;
    const tableRow = document.getElementById('tableData');
    let i=0;
    for(const day of weatherData){
        i++;
        const listEl = document.createElement('td');
        let maxTemp = Math.trunc(day.temp.max);
        let minTemp = Math.trunc(day.temp.min);
        let dayOfWeek = dayjs(day.dt*1000).format('ddd, MMM DD YYYY');
        listEl.textContent = `${dayOfWeek} ${maxTemp}°F/${minTemp}°F Humidity: ${day.humidity}% Wind Speed: ${day.wind_speed}mph (${day.weather[0].description}) `;
        listEl.style.backgroundImage = `url(https://openweathermap.org/img/wn/${day.weather[0].icon}.png)`;
        listEl.style.backgroundSize = `cover`;
        tableRow.appendChild(listEl);
        if(i>4){
            break;
        }
    }
  }
  
  getWeatherForecast();
  



// getApi()
//     .then(displayData)
//     .catch(onError);