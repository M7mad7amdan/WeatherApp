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
  statusBadge.textContent = "Loading...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    const condition = data.weather[0].main;
    const temp = data.main.temp;

    weatherCondition.textContent = condition;
    temperature.textContent = `${temp} °C`;

    const led = mapWeatherToLED(condition, temp);
    ledOutput.textContent = led;

    projectMessage.textContent = `Sending "${led}" signal to ESP32...`;
    statusBadge.textContent = "Updated";

  } catch (error) {
    console.error(error);
    projectMessage.textContent = "Error fetching weather data!";
    statusBadge.textContent = "Error";
  }
});

function mapWeatherToLED(condition, temp) {
  if (condition === "Rain") return "Blue LED";
  if (condition === "Clouds") return "White LED";
  if (condition === "Clear") {
    if (temp > 30) return "Red LED";
    return "Yellow LED";
  }
  return "Yellow LED";
}