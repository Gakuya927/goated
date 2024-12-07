// Track incubator state
let incubatorRunning = false;
let temperatureData = [];
let humidityData = [];
let timeLabels = [];

// Create a chart instance
let tempHumidityChart;

// Set up event listeners for Start and Stop buttons
function setupButtonControls() {
    const startButton = document.getElementById('start-incubation');
    const stopButton = document.getElementById('stop-incubation');
    const incubatorState = document.getElementById('incubator-state');
    const statusMessage = document.getElementById('status-message');
    const logTableBody = document.getElementById('log-table-body');

    // Ensure log table is visible
    if (logTableBody) {
        logTableBody.innerHTML = ''; // Clear "No logs available" message when starting
    }

    if (startButton && stopButton) {
        // Start Incubation
        startButton.addEventListener('click', () => {
            // Check if incubator state is already running
            if (incubatorRunning) {
                return; // Prevent multiple start clicks
            }

            incubatorRunning = true; // Update state
            incubatorState.textContent = 'Running';
            incubatorState.style.color = 'green';
            statusMessage.textContent = 'Status: Incubation is running.';
            statusMessage.style.color = 'green';

            // Log the event
            const now = new Date().toLocaleString();
            addLogEntry(logTableBody, now, '--', '--', 'Running');
        });

        // Stop Incubation
        stopButton.addEventListener('click', () => {
            // Check if incubator state is already stopped
            if (!incubatorRunning) {
                return; // Prevent multiple stop clicks
            }

            incubatorRunning = false; // Update state
            incubatorState.textContent = 'Stopped';
            incubatorState.style.color = 'red';
            statusMessage.textContent = 'Status: Incubation is stopped.';
            statusMessage.style.color = 'red';

            // Log the event
            const now = new Date().toLocaleString();
            addLogEntry(logTableBody, now, '--', '--', 'Stopped');
        });
    } else {
        console.error("Start/Stop buttons not found in the DOM.");
    }
}

// Add a new log entry to the table
function addLogEntry(tableBody, timestamp, temperature, humidity, state) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${timestamp}</td>
        <td>${temperature}</td>
        <td>${humidity}</td>
        <td>${state}</td>
    `;
    tableBody.prepend(row); // Add the new entry at the top
}

// Function to initialize the chart
function initializeChart() {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    // Create the chart instance
    tempHumidityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}

// Periodically update logs with temperature and humidity data
function startPeriodicUpdates(interval = 5000) {
    const logTableBody = document.getElementById('log-table-body');

    setInterval(async () => {
        try {
            const response = await fetch('/.netlify/functions/temperature');
            const data = await response.json();
            const now = new Date().toLocaleString();

            // Update the temperature and humidity on the Status Modal
            const temperature = data.temperature ?? '--';
            const humidity = data.humidity ?? '--';
            document.getElementById('temperature').innerText = `${temperature} °C`;
            document.getElementById('humidity').innerText = `${humidity} %`;

            // Add a log entry only if the incubator is running
            if (incubatorRunning) {
                addLogEntry(logTableBody, now, temperature, humidity, 'Running');
            } else {
                addLogEntry(logTableBody, now, temperature, humidity, 'Stopped');
            }

            // Update the chart data
            timeLabels.push(timeLabels.length + 1); // Add new timestamp for x-axis
            temperatureData.push(temperature); // Add new temperature value
            humidityData.push(humidity); // Add new humidity value

            // Update chart with new data
            tempHumidityChart.update();

        } catch (error) {
            console.error("Error fetching temperature and humidity data:", error);
        }
    }, interval);
}

// Call setup functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupButtonControls();  // Set up event listeners for Start/Stop buttons
    initializeChart();  // Initialize the chart
    startPeriodicUpdates();  // Start the periodic update of temperature/humidity
});
