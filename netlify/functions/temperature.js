// This file will simulate real-time temperature and humidity data

exports.handler = async function(event, context) {
    // Simulate random temperature between 20 and 40°C
    const temperature = (Math.random() * (40 - 20) + 20).toFixed(2);
  
    // Simulate random humidity between 30 and 70%
    const humidity = (Math.random() * (70 - 30) + 30).toFixed(2);
  
    // Return the data as JSON
    return {
      statusCode: 200,
      body: JSON.stringify({ temperature, humidity })
    };
  };
  