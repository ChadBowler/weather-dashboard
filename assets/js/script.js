const body = document.querySelector('html');
var savedPlaces = JSON.parse(localStorage.getItem('savedPlaces'));
var searchForm = document.getElementById('searchForm');
var searchList = document.getElementById('searchList');
var countrySelect = document.getElementById('countrySelect');
const sunny = 'assets/images/sun_wo_bg.png';
const partlyCloudy = 'assets/images/sun_cloud_wo_bg.png';
const cloudy = 'assets/images/cloud_wo_bg.png';
const rainy = 'assets/images/rain_cloud_wo_bg.png';
const haze = 'assets/images/haze_wo_bg.png';
const thunder = 'assets/images/thundercloud_wo_bg.png';
const snowy = 'assets/images/snowflake_wo_bg.png';
const stateRequest = {"country": "United States"};
var check="";
var lat;
var lon;

//event listener to add state selection if 'US' is selected country
countrySelect.addEventListener('change', addStateSelect);
searchForm.addEventListener('submit', processForm);
//event listener for the 'recently searched' list
searchList.addEventListener('click', function(event){
  event.stopImmediatePropagation();

  if((event.target.tagName == 'BUTTON')){
    check = event.target.innerText;
    for(let i=0;i<savedPlaces.length;i++){
      if(check == savedPlaces[i].place.trim()){
        lat = savedPlaces[i].lat;
        lon = savedPlaces[i].lon;
        getWeatherForecast(lat, lon);
        displayLocation();
        break;
      } else {
      }
    }
  }
});
//get country codes from countriesnow for the search selection
async function getCountryCodes(){
    const codesUrl = `https://countriesnow.space/api/v0.1/countries/iso`;
    const response = await fetch(codesUrl, { cache: "no-cache" });
    const data = await response.json();
    countrySelectOptions(data);
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
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
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
    if(state == ""){
      var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=5&appid=efc57a7623532e34f2cd174588ac46a8`;
    } else {
      var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=5&appid=efc57a7623532e34f2cd174588ac46a8`;
    }
   try {
    const response = await fetch(locationUrl, { cache: "no-cache" });
    if(response.ok){
      const data = await response.json();
      lat = `${(data[0].lat.toFixed(4))}`;
      lon = `${(data[0].lon.toFixed(4))}`;
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

    try {
      if(data[0].state == undefined){
        place.innerText = `${data[0].name}, ${data[0].country}`;
      } else{
        place.innerText = `${data[0].name}, ${data[0].state}, ${data[0].country}`;
      }
    } catch (error) {
      place.innerText = check;
    };

    while (cityState.hasChildNodes()) {
      cityState.removeChild(cityState.firstChild);
    };
    
    cityState.appendChild(place);
    saveSearchList(place);
};
//taking items from local storage and displaying them on screen
function displaySearchList(){
  try {
    while(searchList.hasChildNodes()){
      searchList.removeChild(searchList.firstChild);
    };
    if(savedPlaces.length>7){
      savedPlaces.pop();
    };
    for(let i=0;i<savedPlaces.length;i++){
      let searchListItem = document.createElement('button');
      searchListItem.classList.add("list-group-item", "searchListButtons");
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
  if(savedPlaces!==null){
    for(let i=0;i<savedPlaces.length;i++){
      if(savedPlaces[i].place == place.innerText){
        savedPlaces.splice(i, 1);
      }
    }
    savedPlaces.unshift({
      place: place.innerText.trim(),
      lat: lat,
      lon: lon
    });
    }
   else{
    savedPlaces = [];
    savedPlaces.unshift({
      place: place.innerText.trim(),
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
      const response = await fetch(weatherUrl, { cache: "no-cache" });
      if(response.ok){
        const data = await response.json();
        displayCurrent(data);
        displayWeather(data);
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
        let weatherIcon = document.createElement('td');
        let weatherIconImage = document.createElement('img');
        let weatherID = day.weather[0].id;
        weatherDate.textContent = `${dayOfWeek}`;
        weatherTemp.textContent = `${maxTemp}°F/${minTemp}°F`;
        weatherHumid.textContent = `Humidity: ${day.humidity}%`;
        weatherWindSpeed.textContent = `Wind Speed: ${day.wind_speed}mph`;
        weatherCondition.textContent = `${day.weather[0].description}`;
        weatherCondition.classList.add('align-bottom');
        //timeout to sync up with background transition
        setTimeout(()=>{
          tableDate.appendChild(weatherDate);
          tableTemp.appendChild(weatherTemp);
          tableHumid.appendChild(weatherHumid);
          tableWindSpeed.appendChild(weatherWindSpeed);
          tableCondition.appendChild(weatherCondition);
          weatherIcon.append(weatherIconImage);
          weatherCondition.appendChild(weatherIcon);
        }, 500);
        
        if (weatherID >= 200 && weatherID <= 232) {
          weatherIconImage.src = thunder;
        } else if(weatherID >= 300 && weatherID <= 532) {
          weatherIconImage.src = rainy;
        } else if(weatherID >= 600 && weatherID <= 622) {
          weatherIconImage.src = snowy;
        } else if(weatherID >= 701 && weatherID <= 781) {
          weatherIconImage.src = haze;
        } else if(weatherID === 800) {
          weatherIconImage.src = sunny;
        } else if(weatherID >= 801 && weatherID <= 802) {
          weatherIconImage.src = partlyCloudy;
        } else if(weatherID >= 803 && weatherID <= 804) {
          weatherIconImage.src = cloudy;
        }
        weatherIconImage.style.maxWidth = '100px';
        weatherIconImage.style.maxHeight = '100px';

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
    var currentWeatherIcon = document.getElementById('currentWeatherIcon');
    let currentIconId = current.weather[0].id;
    let mainBG = document.getElementById('body').classList;
    let tableText = document.getElementById('forecast').classList;
    var place;
    
    try {
      place = document.getElementById('place').innerText;
    } catch (error) {
      place = check;
    };

    //theme transition based on current weather conditions
    mainBG.remove('clearBlueSkyBG' ,'thunderstormBG', 'cloudyBG', 'snowyBG', 'rainyBG', 'partlyCloudyBG');
    if (currentIconId >= 200 && currentIconId <= 232) {
      backgroundTransition();
      setTimeout(()=>{
        currentWeatherIcon.src = thunder;
        mainBG.add('thunderstormBG');
        tableText.remove('blackText');
        tableText.add('whiteText');
      }, 500);
        
    } else if(currentIconId >= 300 && currentIconId <= 532) {
      backgroundTransition();
      setTimeout(()=>{
        currentWeatherIcon.src = rainy;
        mainBG.add('rainyBG');
        tableText.remove('blackText');
        tableText.add('whiteText');
      }, 500);
      
    } else if(currentIconId >= 600 && currentIconId <= 622) {
      backgroundTransition();
      setTimeout(()=>{
        currentWeatherIcon.src = snowy;
        mainBG.add('snowyBG');
        tableText.remove('blackText');
        tableText.add('whiteText');
      }, 500);
      
    } else if(currentIconId >= 701 && currentIconId <= 781) {
      backgroundTransition();
      setTimeout(()=>{
        currentWeatherIcon.src = haze;
        mainBG.add('cloudyBG');
        tableText.remove('blackText');
        tableText.add('whiteText');
      }, 500);
      
    } else if(currentIconId === 800) {
      backgroundTransition();
      setTimeout(()=>{
        currentWeatherIcon.src = sunny;
        mainBG.add('clearBlueSkyBG');
        tableText.remove('whiteText');
        tableText.add('blackText');
      }, 500);
      
    } else if(currentIconId >= 801 && currentIconId <= 802) {
      backgroundTransition();
      setTimeout(()=>{
        currentWeatherIcon.src = partlyCloudy;
        mainBG.add('partlyCloudyBG');
        tableText.remove('whiteText');
        tableText.add('blackText');
      }, 500);
      
    } else if(currentIconId >= 803 && currentIconId <= 804) {
      backgroundTransition();
      setTimeout(()=>{
        currentWeatherIcon.src = cloudy;
        mainBG.add('cloudyBG');
        tableText.remove('blackText');
        tableText.add('whiteText');
      }, 500);
      
    }

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
//function to ease the transition of the background
function backgroundTransition(){
  body.animate(
    [
      {opacity: '100'},
      {opacity: '0'},
      {opacity: '100'}
    ],
    1000
  );
};
//called as soon as it's ready. Don't need an invitation to run these
getCountryCodes();
getStateCodes(stateRequest);
displaySearchList();
