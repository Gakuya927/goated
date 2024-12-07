// Fetch temperature and humidity data from Netlify function
async function getTemperatureData() {
    try {
        const response = await fetch('/.netlify/functions/temperature');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Update the temperature and humidity values
        const temperature = data.temperature ?? '--';
        const humidity = data.humidity ?? '--';

        document.getElementById('temperature').innerText = `${temperature} °C`;
        document.getElementById('humidity').innerText = `${humidity} %`;
    } catch (error) {
        console.error("Error fetching temperature and humidity data:", error);
        document.getElementById('temperature').innerText = '-- °C';
        document.getElementById('humidity').innerText = '-- %';
    }
}

// Set up event listeners for Start and Stop buttons
function setupButtonControls() {
    const startButton = document.getElementById('start-incubation');
    const stopButton = document.getElementById('stop-incubation');
    const incubatorState = document.getElementById('incubator-state');
    const statusMessage = document.getElementById('status-message');

    if (startButton && stopButton) {
        startButton.addEventListener('click', () => {
            incubatorState.textContent = 'Running';
            incubatorState.style.color = 'green';
            statusMessage.textContent = 'Status: Incubation is running.';
            statusMessage.style.color = 'green';
        });

        stopButton.addEventListener('click', () => {
            incubatorState.textContent = 'Stopped';
            incubatorState.style.color = 'red';
            statusMessage.textContent = 'Status: Incubation is stopped.';
            statusMessage.style.color = 'red';
        });
    } else {
        console.error("Start/Stop buttons not found in the DOM.");
    }
}

// Update the temperature and humidity periodically
function startPeriodicUpdates(interval = 5000) {
    getTemperatureData(); // Fetch initial data
    setInterval(getTemperatureData, interval); // Periodic updates
}

// Event listener for showing the Status Modal
function setupModalEventListener() {
    const statusModal = document.getElementById('statusModal');
    if (statusModal) {
        statusModal.addEventListener('show.bs.modal', () => {
            getTemperatureData();
        });
    } else {
        console.error("Status Modal not found in the DOM.");
    }
}

// Initialize the settings form functionality
function setupSettingsForm() {
    const saveButton = document.getElementById('save-settings');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const humidityInput = document.getElementById('humidity-input').value;
            const temperatureInput = document.getElementById('temperature-input').value;

            if (humidityInput && temperatureInput) {
                console.log(`New Settings - Humidity: ${humidityInput}%, Temperature: ${temperatureInput}°C`);
                alert("Settings saved successfully!");
            } else {
                alert("Please enter valid values for humidity and temperature.");
            }
        });
    } else {
        console.error("Save Settings button not found in the DOM.");
    }
}

// Main function to initialize the script
function initializeEggIncubatorApp() {
    setupButtonControls();
    setupSettingsForm();
    setupModalEventListener();
    startPeriodicUpdates();
}

// Wait for DOM content to fully load before initializing
document.addEventListener('DOMContentLoaded', initializeEggIncubatorApp);
