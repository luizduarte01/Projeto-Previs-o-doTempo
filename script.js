const apiKey = "e1f29133320cf826a322877900d040ca";

async function searchWeather() {
  const cityInput = document.getElementById("city-input").value;
  if (!cityInput) {
    alert("Por favor, insira uma cidade!");
    return;
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await response.json();

    if (data.cod === "404") {
      alert("Cidade não encontrada. Tente novamente!");
      return;
    }

    displayWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    alert("Erro ao buscar os dados do clima.");
    console.error(error);
  }
}

function displayWeather(data) {
  document.getElementById("city").textContent = data.name;
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("temperature").textContent = Math.round(data.main.temp);
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = Math.round(data.wind.speed * 3.6); // Convertendo de m/s para km/h

  const iconCode = data.weather[0].icon;
  document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // Limpar previsões anteriores

    const dailyForecasts = data.list.filter((forecast) => forecast.dt_txt.includes("12:00:00"));
    dailyForecasts.slice(0, 3).forEach((forecast) => {
      const dayElement = document.createElement("div");
      dayElement.classList.add("forecast-day");

      dayElement.innerHTML = `
        <h4>${new Date(forecast.dt_txt).toLocaleDateString("pt-BR", { weekday: "short" })}</h4>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Ícone do clima" />
        <p>${Math.round(forecast.main.temp)}°C</p>
        <p>${forecast.weather[0].description}</p>
      `;

      forecastContainer.appendChild(dayElement);
    });
  } catch (error) {
    console.error("Erro ao buscar previsão estendida:", error);
  }
}

window.onload = searchWeather; // Carregar dados iniciais com localização
