$(document).ready(function () {
  var apiKey = "f1c0b65901691f6fedd6b4fba5b08a11";

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
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
              lat +
              "&lon=" +
              lon +
              "&appid=" +
              apiKey
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              // Prints the weather data to tge console
              console.log(data);
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
});
