// Initialize chart variable
let temperatureChart;
let lastTimeInMinutes = 0; // Variable to track the last time in minutes

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
                        text: 'Time (Minutes)'
                    },
                    ticks: {
                        stepSize: 5, // Set step size for 5-minute intervals
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
    const timeInMinutes = Math.floor(currentTime / 60000);  // Convert to minutes

    // Only update the chart every 5 minutes (if timeInMinutes is a multiple of 5)
    if (timeInMinutes % 5 === 0 && timeInMinutes !== lastTimeInMinutes) {
        lastTimeInMinutes = timeInMinutes;

        // Add new data point to the chart (up to 50 data points)
        if (temperatureChart.data.labels.length > 50) {
            temperatureChart.data.labels.shift();
            temperatureChart.data.datasets[0].data.shift();
            temperatureChart.data.datasets[1].data.shift();
        }

        temperatureChart.data.labels.push(timeInMinutes);
        temperatureChart.data.datasets[0].data.push(temperature);
        temperatureChart.data.datasets[1].data.push(humidity);

        // Update the chart with the new data
        temperatureChart.update();
    }
}

// Add an event listener to update temperature data when the Status Modal opens
document.getElementById('statusModal').addEventListener('show.bs.modal', function () {
    getTemperatureData();
});

// Optionally, you can also update data every few seconds (e.g., every 5 seconds)
setInterval(getTemperatureData, 5000);

// Initialize the chart on page load
window.onload = function () {
    initializeChart();
}
