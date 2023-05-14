var lat
var lon

async function getCountryCodes(){
  const codesUrl = `https://countriesnow.space/api/v0.1/countries/iso`;
  const response = await fetch(codesUrl);
  const data = await response.json();
  countrySelectOptions(data);
  console.log(data);
}

function countrySelectOptions(data){
  let countrySelect = document.getElementById('countrySelect');
  for(let i=0;i<data.data.length;i++) {
    let newOption = document.createElement('option');
    newOption.value = `${data.data[i].Iso2}`;
    newOption.text = `${data.data[i].name}`;
    countrySelect.add(newOption);
 }
}
 const stateRequest = {"country": "United States"};

async function getStateCodes(data){
  const codesUrl = `https://countriesnow.space/api/v0.1/countries/states`;
  try {
    const response = await fetch(codesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success:", result);
    stateSelectOptions(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

function stateSelectOptions(data){
  let stateSelect = document.getElementById('stateSelect');
  for(let i=0;i<data.data.states.length;i++) {
    let newOption = document.createElement('option');
    newOption.value = `${data.data.states[i].state_code}`;
    newOption.text = `${data.data.states[i].name}`;
    stateSelect.add(newOption);
 }
}

function addStateSelect(){
  let countryChoice = document.getElementById('countrySelect').value;
  let stateChoice = document.getElementById('stateSelect').classList;
  let islandStateChoice = document.getElementById('islandStateSelect').classList;
  if((countryChoice == 'US') && (stateChoice.contains("d-none"))){
    stateChoice.remove("d-none");
    islandStateChoice.add("d-none");
  } else if((countryChoice == 'UM') && (islandStateChoice.contains("d-none"))){
    islandStateChoice.remove("d-none");
    stateChoice.add("d-none");
  } else if((stateChoice.contains("d-none")) === false || (islandStateChoice.contains("d-none")=== false)){
    stateChoice.add("d-none");
    islandStateChoice.add("d-none");
  }
}

function processForm(){
    event.preventDefault();
    let countryChoice = document.getElementById('countrySelect').value;
    let stateChoice = document.getElementById('stateSelect').value;
    let cityChoice = document.getElementById('citySelect').value;
    if(countryChoice !== 'US'){
      stateChoice = "";
    }

    getLocation(countryChoice, cityChoice, stateChoice);
    
};

async function getLocation(countryChoice, cityChoice, stateChoice){
    let country = countryChoice;
    let state = stateChoice;
    let city = cityChoice;
    console.log(country, state, city);
    var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=5&appid=efc57a7623532e34f2cd174588ac46a8`;
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
    place.setAttribute('id', 'place');
    while (cityState.hasChildNodes()) {
      cityState.removeChild(cityState.firstChild);
    }
    if(data[0].state == undefined){
      place.innerText = `${data[0].name}, ${data[0].country} `;
    } else{
      place.innerText = `${data[0].name}, ${data[0].state}, ${data[0].country} `;
    }
    cityState.appendChild(place);
  };

async function getWeatherForecast(lat, lon) {
    var weatherUrl = `http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=efc57a7623532e34f2cd174588ac46a8&units=imperial`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    
    displayCurrent(data);
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
    const tableBody = document.getElementById('forecast');
    while(tableDate.hasChildNodes() || tableTemp.hasChildNodes() || tableHumid.hasChildNodes() || tableWindSpeed.hasChildNodes() || tableCondition.hasChildNodes()){
      tableDate.removeChild(tableDate.firstChild);
      tableTemp.removeChild(tableTemp.firstChild);
      tableHumid.removeChild(tableHumid.firstChild);
      tableWindSpeed.removeChild(tableWindSpeed.firstChild);
      tableCondition.removeChild(tableCondition.firstChild);
    }
    let i=1;
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
        if(i>5){
            break;
        }
    }
  }

  function displayCurrent(data){
    let current = data.current;
    let currentTemp = Math.trunc(current.temp);
    let currentDate = dayjs(current.dt*1000).format('ddd, MMM, DD');
    let weatherCard = document.getElementById('currentWeatherCard');
    
    // let place = document.getElementById('place').innerText;
    // let currentPlace = document.createElement('h3');
    // let weatherDate = document.createElement('span');
    // let weatherTemp = document.createElement('span');
    // let weatherHumid = document.createElement('span');
    // let weatherWindSpeed = document.createElement('span');
    // let weatherCondition = document.createElement('span');
    // let br = document.createElement('br');
    // currentPlace.textContent = `Current Weather in: ${place}`;
    // weatherDate.textContent = currentDate;
    // weatherTemp.textContent = `Temp: ${currentTemp}°F`;
    // weatherHumid.textContent = `Humidity: ${current.humidity}%`;
    // weatherWindSpeed.textContent = `Wind Speed: ${current.wind_speed}mph`;
    // weatherCondition.textContent = `Current Conditions: ${current.weather[0].description}`;
    
    
    //   while(weatherCard.hasChildNodes()){
    //     weatherCard.removeChild(weatherCard.firstChild);
    //   }
    
    // weatherCard.appendChild(currentPlace);
    // weatherCard.appendChild(br);
    // weatherCard.appendChild(weatherDate);
    // weatherCard.appendChild(br);
    // weatherCard.appendChild(weatherTemp);
    // weatherCard.appendChild(br);
    // weatherCard.appendChild(weatherHumid);
    // weatherCard.appendChild(br);
    // weatherCard.appendChild(weatherWindSpeed);
    // weatherCard.appendChild(br);
    // weatherCard.appendChild(weatherCondition);
    // console.log(weatherCard);

    let place = document.getElementById('place').innerText;
    let elements = [
      {
        "element": document.createElement('h3'),
        "textContent": `Current Weather in: ${place}`
      },
      {
        "element": document.createElement('span'),
        "textContent": currentDate
      },
      {
        "element": document.createElement('span'),
        "textContent": `Temp: ${currentTemp}°F`
      },
      {
        "element": document.createElement('span'),
        "textContent": `Humidity: ${current.humidity}%`
      },
      {
        "element": document.createElement('span'),
        "textContent": `Wind Speed: ${current.wind_speed}mph`
      },
      {
        "element": document.createElement('span'),
        "textContent": `Current Conditions: ${current.weather[0].description}`
      }
    ];

    while(weatherCard.hasChildNodes()){
      weatherCard.removeChild(weatherCard.firstChild);
    }

    for (let element of elements) {
      element.element.textContent = element.textContent;
      weatherCard.appendChild(element.element);
      weatherCard.appendChild(document.createElement('br'));
    }

  }

  
  
  getCountryCodes();
  getStateCodes(stateRequest);
//   getLocation();
