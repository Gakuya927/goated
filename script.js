// Get button and status elements
const startButton = document.getElementById('start-incubation');
const stopButton = document.getElementById('stop-incubation');
const incubatorState = document.getElementById('incubator-state');
const statusMessage = document.getElementById('status-message');

// Add event listeners for Start and Stop buttons
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
document.getElementById("save-settings").addEventListener("click", () => {
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

    // Update logs table
    const logTableBody = document.getElementById("log-table-body");

    // Get current timestamp
    const timestamp = new Date().toLocaleString();

    // Create a new row
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${timestamp}</td>
        <td>${temperatureInput} °C</td>
        <td>${humidityInput} %</td>
        <td>Settings Updated</td>
    `;

    // Add the new row to the table
    logTableBody.appendChild(newRow);

    // Clear the "No logs available" message if it exists
    const noLogsMessage = logTableBody.querySelector("tr td[colspan='4']");
    if (noLogsMessage) {
        noLogsMessage.parentElement.removeChild(noLogsMessage);
    }

    // Close the modal (optional)
    const settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"));
    settingsModal.hide();

    alert("Settings updated successfully and logged.");
});
// Triggering the chick hatching notification modal
function showChickHatchNotification() {
    const myModal = new bootstrap.Modal(document.getElementById('chickHatchModal'));
    myModal.show();
}

// Simulating a chick hatching detection event (for testing purposes)
setTimeout(() => {
    showChickHatchNotification();
}, 5000);  // Modal will appear 5 seconds after the page loads (for demo)
// Connect to WebSocket server running on 127.0.0.1:8080
const socket = new WebSocket('ws://127.0.0.1:8080');

// When the WebSocket is open (connected), log it to the console
socket.onopen = () => {
  console.log('Connected to WebSocket server');
};

// When the WebSocket receives a message (from Node.js server via MQTT), handle it
socket.onmessage = (event) => {
  const data = event.data;  // The data received from the WebSocket
  console.log('Received data:', data);

  // Update your frontend with the received data (e.g., temperature)
  document.getElementById('temperature').textContent = `Temperature: ${data} °C`;
};

// Handle WebSocket errors
socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

