$(document).ready(function () {
  var apiKey = "f1c0b65901691f6fedd6b4fba5b08a11";
  var searchHistory = [];

  // Loads search history from local storage
  loadSearchHistory();

  // Event Listener for when the user clicks on the search button
  $("#search-button").on("click", function (event) {
    event.preventDefault();
    // Gets the value entered by the user
    var cityName = $("#search-input").val();

    // Calls the function to fetch weather data with the updated cityName
    fetchWeatherData(cityName);
  });

  function fetchWeatherData(cityName) {
    // Makes API request to geocoding API using the cityName
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length > 0) {
          var lat = data[0].lat;
          var lon = data[0].lon;

          // Uses the lat and lon values to fetch weather data
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (currentWeatherData) {
              // Displays current weather conditions
              displayCurrentWeather(currentWeatherData);

              // Stores the city in the search history
              addToSearchHistory(cityName);

              // Fetches and displays 5-day forecast
              fetch5DayForecast(lat, lon);
            })
            .catch(function (error) {
              console.error(error);
            });
        } else {
          console.log("City not found");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function fetch5DayForecast(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (forecastData) {
        // Displays 5-day forecast
        display5DayForecast(forecastData);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  //function to display today's weather
  function displayCurrentWeather(data) {
    var todaySection = $("#today");
    todaySection.html("");

    var cityName = data.name;
    var date = dayjs(data.dt * 1000);
    var iconUrl =
      "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var temperature = data.main.temp - 273.15;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    //Uses jQuery to dislay the weather for today's date.
    var currentWeatherHtml = $("<h2>")
      .text(cityName)
      .add($("<p>").text(date.format("MMMM D, YYYY "))) // Format the date
      .add($("<img>").attr("src", iconUrl).attr("alt", "Weather Icon"))
      .add($("<p>").text("Temperature: " + temperature.toFixed() + " °C"))
      .add($("<p>").text("Humidity: " + humidity + "%"))
      .add($("<p>").text("Wind Speed: " + windSpeed + " m/s"));

    todaySection.append(currentWeatherHtml);
  }

  function display5DayForecast(data) {
    var forecastSection = $("#forecast");
    forecastSection.html("");
    //For loop skips 8 iterations because the OpenWeatherMap API gets weather data in 3 hour invtervals so skipping 8 the next day's weather forecast can be found.
    for (var i = 1; i < data.list.length; i += 8) {
      var forecastDate = dayjs(data.list[i].dt * 1000);
      var iconUrl =
        "http://openweathermap.org/img/w/" +
        data.list[i].weather[0].icon +
        ".png";
      var temperature = data.list[i].main.temp - 273.15;

      var forecastHtml = $("<div>")
        .addClass("col-md-2")
        .append($("<p>").text(forecastDate.format("dddd, MMMM D, YYYY")))
        .append($("<img>").attr("src", iconUrl).attr("alt", "Weather Icon"))
        .append($("<p>").text("Temperature: " + temperature.toFixed() + " °C"));

      forecastSection.append(forecastHtml);
    }
  }
  // Function to retrieve search history from local storage
  function loadSearchHistory() {
    var storedHistory = localStorage.getItem("searchHistory");

    if (storedHistory) {
      searchHistory = JSON.parse(storedHistory);
      displaySearchHistory();
    }
  }

  function addToSearchHistory(cityName) {
    // Add cityName to search history
    searchHistory.push(cityName);

    // Saves updated search history to local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Displays updated search history
    displaySearchHistory();
  }

  function displaySearchHistory() {
    var historyList = $("#history");
    historyList.html(""); // Clears previous results

    // Displays search history
    for (var i = 0; i < searchHistory.length; i++) {
      var historyItem = $("<li>").append(
        $("<button>").addClass("historyButton").text(searchHistory[i])
      );
      historyList.append(historyItem);
    }

    // Event Listener to display weather data when the previous city button's from the search history are clicked.
    $(".historyButton").on("click", function () {
      var selectedCity = $(this).text();
      fetchWeatherData(selectedCity);
    });
  }
});
