function init(){

let fetchButton = document.getElementById('fetch-button');
let currentWeatherEl = document.getElementById('current-weather')
let cityEl = document.getElementById("enter-city-name");
let nameEl = document.getElementById("city-name");
let currentPicEl = document.getElementById("current-pic");
let currentTempEl = document.getElementById("temperature");
let currentHumidityEl = document.getElementById("humidity");
let currentWindEl = document.getElementById("wind-speed");
let currentUVEl = document.getElementById("UV-index");
let fiveDayEl = document.getElementById("five-day-forecast");
let historyEl = document.getElementById("history");
let clearEl = document.getElementById("clear-history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

const apiKey = "3ec9ebfa550c41947096967b17d132e7";

function getApi(event) {
  event.preventDefault();
  let cityName = cityEl.value.trim();
        let searchTerm = cityEl.value;
      // getApi(searchTerm);
      searchHistory.push(searchTerm);
      console.log("1");
      localStorage.setItem("search", JSON.stringify(searchHistory));
      renderSearchHistory();
  let requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey;
  // retrieves data from openweather for user inputted city
  fetch(requestUrl).then(function (response) {
    console.log(response);
    return response.json()

      .then(function (data) {
        console.log(data);
        currentWeatherEl.classList.remove("d-none");
        // current day weather
        let currentDate = moment().format("MMMM, Do, YYYY");
        nameEl.innerHTML = data.name + " " +currentDate;
        let currentWeatherIcon = data.weather[0].icon;
        // let currentPicEl = document.createElement("img");
        currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png");
        currentPicEl.setAttribute("alt", data.weather[0].description);
        currentTempEl.innerHTML = "Temperature: " + data.main.temp + " &#176C";
        currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
        currentWindEl.innerHTML = "Wind Speed: " + data.wind.speed + " m/s";

        let lat = data.coord.lat;
        let lon = data.coord.lon;
        let uvRequestUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";

        fetch(uvRequestUrl)
        .then(function (response) {
          return response.json()

            .then(function (data) {
              console.log(data);
              console.log(uvRequestUrl);
              let UVIndex = document.createElement("span");
              //UV Index
              // When UV Index is safe, it's green, moderate, it's yellow, severe, it's red
              if (data.current.uvi < 4) {
                UVIndex.setAttribute("class", "badge badge-success");
              } else if (data.current.uvi < 8) {
                UVIndex.setAttribute("class", "badge badge-warning");
              } else {
                UVIndex.setAttribute("class", "badge badge-danger");
              }
              UVIndex = data.current.uvi;
              currentUVEl.innerHTML = "UV Index: ";
              currentUVEl.append(UVIndex);
            });
        });
        // five day forecast
        let forecastRequestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;
        fetch(forecastRequestUrl)
        .then (function (response) {
          return response.json()

          .then(function (data) {
            console.log(data);
            fiveDayEl.classList.remove("d-none");
            let forecastEl = document.querySelectorAll(".forecast");
            for (i = 0; i < forecastEl.length; i++) {
              forecastEl[i].innerHTML = "";
              //  5-day forecast display
              let forecastDate = moment().add(i + 1, "days").format("MMMM/DD/YYYY");
              let forecastTemp = data.list[i].main.temp + " &#176C"
              let forecastWind = data.list[i].wind.speed + " m/s"
              let forecastHumidity = data.list[i].main.humidity + "%"

              let forecastDateEl = document.createElement("p");
              forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
              forecastDateEl.innerHTML = forecastDate;
              forecastEl[i].append(forecastDateEl);

              let forecastWeatherEl = document.createElement("img");
              forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png");
              forecastWeatherEl.setAttribute("alt", data.list[i].weather[0].description);
              forecastEl[i].append(forecastWeatherEl);

              let forecastTempEl = document.createElement("p");
              forecastTempEl.innerHTML = ("Temp: ") + forecastTemp;
              forecastEl[i].append(forecastTempEl);

              let forecastHumidityEl = document.createElement("p");
              forecastHumidityEl.innerHTML = ("Humidity: ") + forecastHumidity;
              forecastEl[i].append(forecastHumidityEl);

              let forecastWindEl = document.createElement("p");
              forecastWindEl.innerHTML = ("Wind Speed: ") + forecastWind;
              forecastEl[i].append(forecastWindEl);
            }
          });
        });
  // Clear History button
  clearEl.addEventListener("click", function () {
      localStorage.clear();
      searchHistory = [];
      renderSearchHistory();
          })
      });
  });
};

function renderSearchHistory() {
  historyEl.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
      let historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
      })
      historyEl.append(historyItem);
  }
}

fetchButton.addEventListener('click', getApi);

}

init()