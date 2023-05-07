const API_KEY = "85d85292f0451bf371fb5829c79d0d3e";
const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Tampere&units=metric&appid=${API_KEY}`;

async function getWeatherData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const weatherData = data.list.slice(0, 50);
    const weatherTable = document.getElementById("weather-data");
    weatherTable.innerHTML = "";
    weatherData.forEach((reading) => {
      const row = weatherTable.insertRow(-1);
      const dateCell = row.insertCell(0);
      const tempCell = row.insertCell(1);
      const humidityCell = row.insertCell(2);
      const windCell = row.insertCell(3);
      const descCell = row.insertCell(4);
      const date = new Date(reading.dt * 1000);
      dateCell.innerText = date.toLocaleString();
      tempCell.innerText = reading.main.temp.toFixed(1);
      humidityCell.innerText = `${reading.main.humidity}%`;
      windCell.innerHTML = `<div>Wind Speed</div>${reading.wind.speed.toFixed(1)} m/s`;
      descCell.innerText = reading.weather[0].description;
    });
  } catch (error) {
    console.error(error);
  }
}

getWeatherData();


async function getWindData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const windData = [];
    data.list.forEach((reading) => {
      windData.push({
        date: new Date(reading.dt * 1000).toLocaleString(),
        speed: reading.wind.speed.toFixed(1),
        direction: reading.wind.deg.toFixed(1)
      });
    });
    const windTable = document.getElementById("wind-data");
    windTable.innerHTML = "";
    windData.slice(-20).forEach((reading) => {
      const row = windTable.insertRow(-1);
      const dateCell = row.insertCell(0);
      const speedCell = row.insertCell(1);
      const directionCell = row.insertCell(2);

      dateCell.innerText = reading.date;
      speedCell.innerText = reading.speed;
      directionCell.innerText = reading.direction;
      directionCell.setAttribute("title", "Wind Direction");
    });

    const windChartData = {
      labels: windData.slice(-20).map((reading) => reading.date),
      datasets: [{
        label: "Wind Speed (m/s)",
        data: windData.slice(-20).map((reading) => reading.speed),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        tension: 0.1,
        fill: "origin"
      }]
    };

    const windChartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    const windChartCanvas = document.getElementById("wind-chart");
    new Chart(windChartCanvas, {
      type: "line",
      data: windChartData,
      options: windChartOptions
    });

  } catch (error) {
    console.error(error);
  }
}


getWindData();



async function getTempData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const feelsLikeData = [];
    const dateLabels = [];
    data.list.slice(-20).forEach((reading) => {
      feelsLikeData.push(reading.main.feels_like.toFixed(1));
      dateLabels.push(new Date(reading.dt * 1000).toLocaleString());
    });
    const feelsLikeTable = document.getElementById("temp-data");
    feelsLikeTable.innerHTML = "";
    data.list.slice(-20).forEach((reading) => {
      const row = feelsLikeTable.insertRow(-1);
      const dateCell = row.insertCell(0);
      const feelsLikeCell = row.insertCell(1);
      dateCell.innerText = new Date(reading.dt * 1000).toLocaleString();
      feelsLikeCell.innerText = reading.main.feels_like.toFixed(1);
    });
    const ctx = document.getElementById("feels-like-chart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dateLabels,
        datasets: [
          {
            label: "Feels Like Temperature (°C)",
            data: feelsLikeData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            tension: 0.1,
            fill: "origin",
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
}
getTempData();

const feelsLikeData = [];
data.list.slice(-20).forEach((reading) => {
  feelsLikeData.push(reading.main.feels_like.toFixed(1));
});

const feelsLikeChart = new Chart(document.getElementById("feels-like-chart"), {
  type: "line",
  data: {
    labels: dateLabels,
    datasets: [
      {
        label: "Feels Like Temperature (°C)",
        data: feelsLikeData,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Latest 20 Feels Like Temperature Readings for Tampere"
      },
      legend: {
        display: false
      }
    }
  }
});
const windData = [];
data.list.slice(-20).forEach((reading) => {
  windData.push({
    date: new Date(reading.dt * 1000).toLocaleString(),
    speed: reading.wind.speed.toFixed(1),
    direction: reading.wind.deg.toFixed(1)
  });
});

const windChart = new Chart(document.getElementById("wind-chart"), {
  type: "area",
  data: {
    labels: windData.map((reading) => reading.date),
    datasets: [
      {
        label: "Wind Speed (m/s)",
        data: windData.map((reading) => reading.speed),
        fill: "origin",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Latest 20 Daily Wind Speed Readings for Tampere"
      },
      legend: {
        display: false
      }
    }
  }
});
