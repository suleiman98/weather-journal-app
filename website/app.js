/* Global Variables */
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "95f94a552ea93c73254fa6d9107448e8";

// Create a new date instance dynamically with JS
let d = new Date();

let newDate = d.toLocaleString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// Getting the weather icons
const getIcon = (type, description, code) => {
  const icon = document.querySelector(".wi");

  switch (type) {
    case "Thunderstorm":
      icon.classList.add("wi-thunderstorm");
      break;

    case "Drizzle":
      icon.classList.add("wi-showers");
      break;

    case "Rain":
      description === "shower rain"
        ? icon.classList.add("wi-rain-mix")
        : icon.classList.add("wi-rain");
      break;

    case "Snow":
      description === "Sleet"
        ? icon.classList.add("wi-sleet")
        : icon.classList.add("wi-snow");
      break;

    case "Mist":
      icon.classList.add("wi-sprinkle");
      break;

    case "Smoke":
      icon.classList.add("wi-smoke");
      break;

    case "Haze":
      icon.classList.add("wi-day-haze");
      break;

    case "Fog":
      icon.classList.add("wi-fog");
      break;

    case "Dust":
      icon.classList.add("wi-dust");
      break;

    case "Sand":
      icon.classList.add("wi-sandstorm");
      break;

    case "Ash":
      icon.classList.add("wi-volcano");
      break;

    case "Squall":
      icon.classList.add("wi-strong-wind");
      break;

    case "Tornado":
      icon.classList.add("wi-tornado");
      break;

    case "Clear":
      code === "01n"
        ? icon.classList.add("wi-night-clear")
        : icon.classList.add("wi-day-sunny");
      break;

    case "Clouds":
      icon.classList.add("wi-cloud");
      break;

    default:
      icon.classList.add("wi-refresh");
      break;
  }
};

// Generating weather data
document.querySelector("#generate").addEventListener("click", generate);

function generate() {
  const zip = document.querySelector("#zip").value;
  const feelings = document.querySelector("#feelings").value;

  getData(baseUrl, zip, apiKey)
    .then((data) => {
      if (String(data.cod) === "404") {
        alert("Please enter valid zip code");
      } else {
        const type = data.weather[0].main;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        postData("http://localhost:8000/add", {
          date: newDate,
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          feel: feelings,
          name: data.name,
          type:
            data.weather[0].main === "Clouds" ? "Cloudy" : data.weather[0].main,
          icon: getIcon(type, description, icon),
        });
      }
    })
    .then(updateUI);

  setTimeout(function () {
    document.querySelector("#form").style.display = "none";
    document.querySelector("#entryHolder").style.display = "block";
  }, 1000);
}

// "Going back" to Generate Event
document.querySelector("#generateMore").addEventListener("click", function () {
  setTimeout(function () {
    document.querySelector("#entryHolder").style.display = "none";
    document.querySelector("#form").style.display = "block";
  }, 1000);
});

// Async GET data
const getData = async (url, zip, apiKey) => {
  const res = await fetch(`${url}${zip},us&units=metric&appid=${apiKey}`);

  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("error", err);
  }
};

// Async POST data
const postData = async (url = "", data = {}) => {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await res.json();
    console.log(newData);
    return newData;
  } catch (err) {
    console.log("error", err);
  }
};

// Dynamic UI Updates
const updateUI = async () => {
  const res = await fetch("http://localhost:8000/dictionary");

  try {
    const dictionary = await res.json();
    document.querySelector("#date").innerHTML = dictionary.date;
    document.querySelector("#temp").innerHTML = `${dictionary.temp}°`;
    document.querySelector("#temp_max").innerHTML = `${dictionary.temp_max}°C`;
    document.querySelector("#temp_min").innerHTML = `${dictionary.temp_min}°C`;
    document.querySelector("#content").innerHTML = dictionary.feel;
    document.querySelector("#name").innerHTML = `${dictionary.name}`;
    document.querySelector("#type").innerHTML = `${dictionary.type}`;
  } catch (err) {
    console.log("error", err);
  }
};
