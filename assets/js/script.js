let tableBody = document.getElementById('results-table');
let fetchButton = document.getElementById('fetch-button');
let currentWeatherEl = document.getElementById('current-weather')
let cityEl = document.getElementById("enter-city-name");
const searchEl = document.getElementById("search-button");
const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("city-name");
const currentPicEl = document.getElementById("current-pic");
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const currentUVEl = document.getElementById("UV-index");
const historyEl = document.getElementById("history");
var fiveDayEl = document.getElementById("five-day-forecast");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];



const apiKey = "3ec9ebfa550c41947096967b17d132e7";

function getApi(event) {
  event.preventDefault();
  let cityName = cityEl.value.trim();
  let requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=metric&appid=" +
    apiKey;
  // retrieves data from openweather for user inputted city
  fetch(requestUrl).then(function (response) {
    console.log(response);
    return response
      .json()

      .then(function (data) {
        console.log(data);
        currentWeatherEl.classList.remove("d-none");

        const currentDate = moment().format("MMMM, Do, YYYY");
        console.log(currentDate);
        nameEl.innerHTML = data.name + currentDate;
        console.log(nameEl);
        let weatherPic = data.weather[0].icon;
        currentPicEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
        );
        currentPicEl.setAttribute("alt", data.weather[0].description);
        currentTempEl.innerHTML = "Temperature: " + data.main.temp + " &#176C";
        currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
        currentWindEl.innerHTML = "Wind Speed: " + data.wind.speed + " m/s";
        console.log(currentTempEl);
        console.log(currentHumidityEl);
        console.log(currentWindEl);

        let lat = data.coord.lat;
        let lon = data.coord.lon;
        let uvRequestUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          apiKey +
          "&cnt=1";
        fetch(uvRequestUrl).then(function (response) {
          return response
            .json()

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
              console.log(UVIndex);
              UVIndex = data.current.uvi;
              currentUVEl.innerHTML = "UV Index: ";
              currentUVEl.append(UVIndex);
            });
        });
        // five day forecast
        let forecastRequestUrl =
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          apiKey;
        fetch(forecastRequestUrl).then(function (response) {
          return response.json().then(function (data) {
            console.log(data);
            fiveDayEl.classList.remove("d-none");
            let forecastEl = document.querySelectorAll(".forecast");
            for (i = 0; i < forecastEl.length; i++) {
              forecastEl[i].innerHTML = "";
              //  create card for 5-day forecast
              //  let forecastIcon = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png'
              // console.log(forecastIcon)
              let forecastDate = moment()
                .add(i + 1, "days")
                .format("MMMM/DD/YYYY");
              //  let forecastTemp = data.daily[i].temp.day
              //  let forecastWind = data.daily[i].wind_speed
              //  let forecastHumidity = data.daily[i].humidity
              let forecastDateEl = document.createElement("p");
              forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
              forecastDateEl.innerHTML = forecastDate;
              forecastEl[i].append(forecastDateEl);
            }
          });
        });
      });
  });
};

fetchButton.addEventListener('click', getApi);