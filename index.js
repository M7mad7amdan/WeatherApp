import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK22RzIHgQe95iSzLOxwLO52dl0HT-xGA",
  authDomain: "weatherwebsite-c16f2.firebaseapp.com",
  databaseURL: "https://weatherwebsite-c16f2-default-rtdb.firebaseio.com",
  projectId: "weatherwebsite-c16f2",
  storageBucket: "weatherwebsite-c16f2.firebasestorage.app",
  messagingSenderId: "680669491127",
  appId: "1:680669491127:web:76dd607cf9b5be5e3cc232",
  measurementId: "G-KC8FREFH83"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const API_KEY = "765decf1958f0b73a049563543e48672";

const citySelect = document.getElementById("citySelect");
const checkBtn = document.getElementById("checkBtn");

const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");
const temperature = document.getElementById("temperature");
const ledOutput = document.getElementById("ledOutput");
const projectMessage = document.getElementById("projectMessage");
const statusBadge = document.getElementById("statusBadge");

checkBtn.addEventListener("click", async () => {
  const selectedCity = citySelect.value;

  cityName.textContent = selectedCity;
  weatherCondition.textContent = "Loading...";
  temperature.textContent = "Loading...";
  ledOutput.textContent = "...";
  projectMessage.textContent = "Checking weather...";
  statusBadge.textContent = "Loading...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric&timestamp=${Date.now()}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Weather API request failed");
    }

    if (!data.weather || !data.main) {
      throw new Error("Invalid weather data");
    }

    const condition = data.weather[0].main;
    const temp = data.main.temp;

    const led = mapWeatherToLED(condition, temp);
    const status = mapWeatherToStatus(condition, temp);

    const weatherPayload = {
      city: selectedCity,
      condition: condition,
      temperature: temp,
      led: led,
      status: status,
      updatedAt: new Date().toISOString(),
      updatedAtMs: Date.now()
    };

    await set(ref(database, "weatherData"), weatherPayload);

    cityName.textContent = selectedCity;
    weatherCondition.textContent = condition;
    temperature.textContent = `${temp} °C`;
    ledOutput.textContent = led;

    projectMessage.textContent = "Weather data sent to Firebase successfully.";
    statusBadge.textContent = "Updated";

    console.log("Firebase updated:", weatherPayload);
  } catch (error) {
    console.error("Error:", error);
    projectMessage.textContent = `Error: ${error.message}`;
    statusBadge.textContent = "Error";
  }
});

function mapWeatherToLED(condition, temp) {
  if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
    return "Blue LED";
  }

  if (condition === "Clouds" || condition === "Mist" || condition === "Fog" || condition === "Haze") {
    return "White LED";
  }

  if (condition === "Clear" && temp > 30) {
    return "Red LED";
  }

  return "Yellow LED";
}

function mapWeatherToStatus(condition, temp) {
  if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
    return "rain";
  }

  if (condition === "Clouds" || condition === "Mist" || condition === "Fog" || condition === "Haze") {
    return "cloudy";
  }

  if (condition === "Clear" && temp > 30) {
    return "hot";
  }

  return "sunny";
}