// const countryData = JSON.parse(document.getElementById('countryCodes').textContent);
var tableBody = document.getElementById('forecast');
var city = document.getElementById('city');
var state = document.getElementById('state');
var lat
var lon
// const xmlhttp = new XMLHttpRequest();
// xmlhttp.onload = function(){
//   const countryData
// }

async function getCountryCodes(){
  const codesUrl = `https://countriesnow.space/api/v0.1/countries/iso`;
  const response = await fetch(codesUrl);
  const data = await response.json();
  countrySelectOptions(data);
  console.log(data);
  
}
function countrySelectOptions(data){
  let countrySelect = document.getElementById('inputGroupSelect01');
  console.log(data.data.length);
  for(let i=0;i<data.data.length;i++) {
    console.log(data.msg);
    let newOption = document.createElement('option');
    newOption.value = `${data.data[i].Iso2}`;
    newOption.text = `${data.data[i].name}`;
    countrySelect.add(newOption);
 }
}



function processForm(){
    event.preventDefault();
    console.log("Success");
};

async function getLocation(){
    // var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Dallas&limit=5&appid=efc57a7623532e34f2cd174588ac46a8`;
    const response = await fetch(locationUrl);
    const data = await response.json();
    
    lat = `${(data[0].lat.toFixed(4))}`;
    lon = `${(data[0].lon.toFixed(4))}`;
    
    displayLocation(data);
    getWeatherForecast(lat, lon);
    console.log(data);
    console.log(data[0].name);
  };

  function displayLocation(data){
    const cityState = document.getElementById('cityState');
    let place = document.createElement('td');

    place.innerText = `${data[0].name}, ${data[0].state} `;
    cityState.appendChild(place);
  };

async function getWeatherForecast(lat, lon) {
    // var weatherUrl = `http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=efc57a7623532e34f2cd174588ac46a8&units=imperial`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    
    displayWeather(data);
    console.log(data);
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
        // const listEl = document.createElement('td');
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
        weatherCondition.textContent = `${day.weather[0].description} ${day.weather[0].icon}.png`;
        // listEl.textContent = `${dayOfWeek} ${maxTemp}°F/${minTemp}°F Humidity: ${day.humidity}% Wind Speed: ${day.wind_speed}mph (${day.weather[0].description}) `;
        // listEl.style.backgroundImage = `url(https://openweathermap.org/img/wn/${day.weather[0].icon}.png)`;
        // listEl.style.backgroundSize = `cover`;
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

  
  
  getCountryCodes();
//   getLocation();
