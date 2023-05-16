var savedPlaces = JSON.parse(localStorage.getItem('savedPlaces'));
var searchButton = document.getElementById('searchButton');
var searchList = document.getElementById('searchList');
var check="";
var lat;
var lon;
const stateRequest = {"country": "United States"};

searchButton.addEventListener('submit', processForm);
//event listener for the 'recently searched' list
searchList.addEventListener('click', function(event){
  event.stopImmediatePropagation();

  if((event.target.tagName == 'BUTTON')){
    check = event.target.innerText;
    for(let i=0;i<savedPlaces.length;i++){
      if(check == savedPlaces[i].place){
        lat = savedPlaces[i].lat;
        lon = savedPlaces[i].lon;
        console.log(lat);
        console.log(lon);
        console.log(check);
        getWeatherForecast(lat, lon);
        displayLocation();
        break;
      }
    }
  }
});
//get country codes from countriesnow for the search selection
async function getCountryCodes(){
    const codesUrl = `https://countriesnow.space/api/v0.1/countries/iso`;
    const response = await fetch(codesUrl);
    const data = await response.json();
    countrySelectOptions(data);
    console.log(data);
}
//populate the country selection form
function countrySelectOptions(data){
    let countrySelect = document.getElementById('countrySelect');
    for(let i=0;i<data.data.length;i++) {
      let newOption = document.createElement('option');
      newOption.value = `${data.data[i].Iso2}`;
      newOption.text = `${data.data[i].name}`;
      countrySelect.add(newOption);
    }
}
//get state codes from countriesnow for the search selection
//need to run a POST request since we only need states from US
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
//populate the state selection form
function stateSelectOptions(data){
    let stateSelect = document.getElementById('stateSelect');
    for(let i=0;i<data.data.states.length;i++) {
      let newOption = document.createElement('option');
      newOption.value = `${data.data.states[i].state_code}`;
      newOption.text = `${data.data.states[i].name}`;
      stateSelect.add(newOption);
    }
}
//displays the state selection option if US is chosen country
function addStateSelect(){
    let countryChoice = document.getElementById('countrySelect').value;
    let stateChoice = document.getElementById('stateSelect').classList;
    if((countryChoice == 'US') && (stateChoice.contains("d-none"))){
      stateChoice.remove("d-none");
    } else if((stateChoice.contains("d-none")) === false){
      stateChoice.add("d-none");
    };
};
//form handler - Starts a chain, calling functions to get all the API data, and display them
//TODO: improve the error handling
function processForm(event){
  event.preventDefault();
  let countryChoice = document.getElementById('countrySelect').value;
  let stateChoice = document.getElementById('stateSelect').value;
  let cityChoice = document.getElementById('citySelect').value;
  if(countryChoice !== 'US'){
    stateChoice = "";
  }
  getLocation(countryChoice, cityChoice, stateChoice);
};
//getting latitude and longitude based on user input passed on from processForm function
async function getLocation(countryChoice, cityChoice, stateChoice){
    let country = countryChoice;
    let state = stateChoice;
    let city = cityChoice;
    console.log(country, state, city);
    console.log(`state: ${state}`);
    if(state == ""){
      var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=5&appid=efc57a7623532e34f2cd174588ac46a8`;
    } else {
      var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=5&appid=efc57a7623532e34f2cd174588ac46a8`;
    }
   try {
    const response = await fetch(locationUrl);
    if(response.ok){
      const data = await response.json();
      lat = `${(data[0].lat.toFixed(4))}`;
      lon = `${(data[0].lon.toFixed(4))}`;
      console.log('hello');
      displayLocation(data);
      getWeatherForecast(lat, lon);
   } else{
      throw new Error(`${response.status}`);
   }
   } catch (error) {
    console.error(error);
   }
};
//display the location in the main section
function displayLocation(data){
    const cityState = document.getElementById('cityState');
    let place = document.createElement('td');
    place.setAttribute('id', 'place');
    while (cityState.hasChildNodes()) {
      cityState.removeChild(cityState.firstChild);
    }
      try {
        if(data[0].state == undefined){
          place.innerText = `${data[0].name}, ${data[0].country} `;
        } else{
          place.innerText = `${data[0].name}, ${data[0].state}, ${data[0].country} `;
        }
      } catch (error) {
        place.innerText = check;
      }
    cityState.appendChild(place);
    saveSearchList(place);
};
//taking items from local storage and displaying them on screen
function displaySearchList(){
  //savedPlaces was declared globally
  console.log(`check: ${check}`);
  try {
    while(searchList.hasChildNodes()){
      searchList.removeChild(searchList.firstChild);
    };
    if(savedPlaces.length>7){
      savedPlaces.pop();
    };
    for(let i=0;i<savedPlaces.length;i++){
      let searchListItem = document.createElement('button');
      searchListItem.classList.add("list-group-item", "list-group-item-action", "list-group-item-success");
      searchListItem.innerText = savedPlaces[i].place;
      searchList.appendChild(searchListItem); 
    };
  } catch (error) {
    let noSearches = document.createElement('h4');
    noSearches.innerText = `No recent searches found`;
    searchList.appendChild(noSearches);
    return;
  };
};
//save searches to local storage
function saveSearchList(place){
  //savedPlaces was declared globally
  if(savedPlaces!==null){
    for(let i=0;i<savedPlaces.length;i++){
      if(savedPlaces[i].place == place.innerText){
        savedPlaces.splice(i, 1);
      }
    }
    savedPlaces.unshift({
      place: place.innerText,
      lat: lat,
      lon: lon
    });
    }
   else{
    savedPlaces = [];
    savedPlaces.unshift({
      place: place.innerText,
      lat: lat,
      lon: lon
    });
  }
  displaySearchList();
  localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces));
}
//use openweathermap API to get weather data using latitude and longitude from geo API
async function getWeatherForecast(lat, lon) {
    var weatherUrl = `http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=efc57a7623532e34f2cd174588ac46a8&units=imperial`;
    try {
      const response = await fetch(weatherUrl);
      if(response.ok){
        const data = await response.json();
        console.log(data);
        displayCurrent(data);
        displayWeather(data);
        console.log(data);
     } else{
        throw new Error(`${response.status}`);
     };
     } catch (error) {
      console.error(error);
     };
};
//clear main section and display new weather data
function displayWeather(data){
    const weatherData = data.daily;
    const tableDate = document.getElementById('weatherDate');
    const tableTemp = document.getElementById('weatherTemp');
    const tableHumid = document.getElementById('weatherHumid');
    const tableWindSpeed = document.getElementById('weatherWindSpeed');
    const tableCondition = document.getElementById('weatherCondition');

    while(tableDate.hasChildNodes() || tableTemp.hasChildNodes() || tableHumid.hasChildNodes() || tableWindSpeed.hasChildNodes() || tableCondition.hasChildNodes()){
        tableDate.removeChild(tableDate.firstChild);
        tableTemp.removeChild(tableTemp.firstChild);
        tableHumid.removeChild(tableHumid.firstChild);
        tableWindSpeed.removeChild(tableWindSpeed.firstChild);
        tableCondition.removeChild(tableCondition.firstChild);
    };

    let i=1;
    for(const day of weatherData){
        i++;
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
        weatherCondition.textContent = `${day.weather[0].description} ${day.weather[0].icon.png}`;
        tableDate.appendChild(weatherDate);
        tableTemp.appendChild(weatherTemp);
        tableHumid.appendChild(weatherHumid);
        tableWindSpeed.appendChild(weatherWindSpeed);
        tableCondition.appendChild(weatherCondition);
        if(i>5){
            break;
        };
    };
};
//clear out and refill current weather card data
function displayCurrent(data){
    let current = data.current;
    let currentTemp = Math.trunc(current.temp);
    let currentDate = dayjs(current.dt*1000).format('ddd, MMM DD');
    let weatherCard = document.getElementById('currentWeatherCard');
    let place;

    try {
      place = document.getElementById('place').innerText;
    } catch (error) {
      place = check;
    };
    
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
        "textContent": `Wind Speed: ${current.wind_speed} mph`
      },
      {
        "element": document.createElement('span'),
        "textContent": `Current Conditions: ${current.weather[0].description}`
      }
    ];

    while(weatherCard.hasChildNodes()){
      weatherCard.removeChild(weatherCard.firstChild);
    };

    for (let element of elements) {
      element.element.textContent = element.textContent;
      weatherCard.appendChild(element.element);
      weatherCard.appendChild(document.createElement('br'));
    };
};
//called as soon as it's ready. Don't need an invitation to run these
getCountryCodes();
getStateCodes(stateRequest);
displaySearchList();
