// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Get button and status elements
    const startButton = document.getElementById('start-incubation');
    const stopButton = document.getElementById('stop-incubation');
    const incubatorState = document.getElementById('incubator-state');
    const statusMessage = document.getElementById('status-message');

    // Add event listeners for Start and Stop buttons
    if (startButton && stopButton && incubatorState && statusMessage) {
        startButton.addEventListener('click', () => {
            incubatorState.textContent = 'Running';
            incubatorState.style.color = 'green'; // Update color to green
            statusMessage.textContent = 'Status: Incubation is running.';
            statusMessage.style.color = 'green';
        });

        stopButton.addEventListener('click', () => {
            incubatorState.textContent = 'Stopped';
            incubatorState.style.color = 'red'; // Update color to red
            statusMessage.textContent = 'Status: Incubation is stopped.';
            statusMessage.style.color = 'red';
        });
    } else {
        console.error("Start/Stop buttons or status elements not found.");
    }

    // Event listener for "Save Settings" button
    const saveSettingsButton = document.getElementById("save-settings");
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener("click", () => {
            // Get input values
            const temperatureInput = document.getElementById("temperature-input").value;
            const humidityInput = document.getElementById("humidity-input").value;

            // Validate inputs
            if (!temperatureInput || !humidityInput) {
                alert("Please enter valid temperature and humidity values.");
                return;
            }

            // Update status section
            document.getElementById("temperature").textContent = `${temperatureInput} °C`;
            document.getElementById("humidity").textContent = `${humidityInput} %`;

            // Update logs
            updateLogsTable(temperatureInput, humidityInput, "Settings Updated");

            // Close the modal (Bootstrap modal)
            const settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"));
            settingsModal.hide();

            alert("Settings updated successfully and logged.");
        });
    } else {
        console.error("'Save Settings' button not found.");
    }

    // Triggering the chick hatching notification modal
    function showChickHatchNotification() {
        const myModal = new bootstrap.Modal(document.getElementById('chickHatchModal'));
        myModal.show();
    }

    // Simulate a chick hatching detection event (for testing purposes)
    setTimeout(() => {
        showChickHatchNotification();
    }, 5000); // Modal will appear 5 seconds after the page loads

    // Function to fetch temperature and humidity data
    function getTemperatureData() {
        fetch('/.netlify/functions/temperature') // Netlify function endpoint
            .then((response) => response.json())
            .then((data) => {
                // Round the temperature and humidity to whole numbers before displaying
                const roundedTemperature = Math.round(data.temperature);
                const roundedHumidity = Math.round(data.humidity);

                // Update the Status Modal fields
                document.getElementById('temperature').textContent = `${roundedTemperature} °C`;
                document.getElementById('humidity').textContent = `${roundedHumidity} %`;

                // Update the logs table
                updateLogsTable(roundedTemperature, roundedHumidity, "Running");
            })
            .catch((error) => {
                console.error('Error fetching temperature data:', error);
            });
    }

    // Function to update the logs table
    function updateLogsTable(temperature, humidity, state) {
        const tableBody = document.getElementById('log-table-body');
        if (!tableBody) {
            console.error("Logs table body not found.");
            return;
        }

        // Remove the placeholder "No logs available" row if it exists
        const noLogsMessage = tableBody.querySelector("tr td[colspan='4']");
        if (noLogsMessage) {
            noLogsMessage.parentElement.removeChild(noLogsMessage);
        }

        // Create a new row
        const row = document.createElement('tr');

        // Format the current timestamp
        const timestamp = new Date().toLocaleString();

        // Add table cells for each piece of data
        row.innerHTML = `
            <td>${timestamp}</td>
            <td>${temperature} °C</td>
            <td>${humidity} %</td>
            <td>${state}</td>
        `;

        // Append the new row to the table
        tableBody.appendChild(row);
    }

    // Fetch temperature data every 5 seconds
    setInterval(getTemperatureData, 5000);
});
