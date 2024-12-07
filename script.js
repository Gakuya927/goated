// Initialize chart variable
let temperatureChart;
let dataFetchInterval;

// Function to fetch temperature and humidity data from Netlify function
async function getTemperatureData() {
    try {
        const response = await fetch('/.netlify/functions/temperature');
        const data = await response.json();

        // Update the temperature and humidity in the Status Modal
        document.getElementById('temperature').innerText = `${data.temperature} °C`;
        document.getElementById('humidity').innerText = `${data.humidity} %`;

        // Update the chart data
        updateChart(data.temperature, data.humidity);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to initialize the chart
function initializeChart() {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],  // Empty initially, will be filled dynamically
            datasets: [
                {
                    label: 'Temperature (°C)',
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    data: [],  // Empty initially, will be filled dynamically
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Humidity (%)',
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    data: [],  // Empty initially, will be filled dynamically
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature and Humidity over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'nearest',
                intersect: false
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Time (Seconds)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

// Function to update the chart with new data
function updateChart(temperature, humidity) {
    const currentTime = Date.now();  // Get the current timestamp
    const timeInSeconds = Math.floor(currentTime / 1000);  // Convert to seconds

    // Add new data point to the chart (up to 50 data points)
    if (temperatureChart.data.labels.length > 50) {
        temperatureChart.data.labels.shift();
        temperatureChart.data.datasets[0].data.shift();
        temperatureChart.data.datasets[1].data.shift();
    }

    temperatureChart.data.labels.push(timeInSeconds);
    temperatureChart.data.datasets[0].data.push(temperature);
    temperatureChart.data.datasets[1].data.push(humidity);

    // Update the chart with the new data
    temperatureChart.update();
}

// Function to start the data fetching and chart updates
function startDataFetching() {
    // Start fetching data every 5 seconds
    dataFetchInterval = setInterval(getTemperatureData, 5000);

    // Disable the Start button and enable the Stop button
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
}

// Function to stop the data fetching and chart updates
function stopDataFetching() {
    // Stop the interval that fetches data
    clearInterval(dataFetchInterval);

    // Enable the Start button and disable the Stop button
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
}

// Add an event listener to update temperature data when the Status Modal opens
document.getElementById('statusModal').addEventListener('show.bs.modal', function () {
    getTemperatureData();
});

// Initialize the chart on page load
window.onload = function () {
    initializeChart();

    // Add event listeners to Start and Stop buttons
    document.getElementById('startButton').addEventListener('click', startDataFetching);
    document.getElementById('stopButton').addEventListener('click', stopDataFetching);
}
