const URL = "https://wms-documentation.onrender.com/"; // Replace with your deployed app URL

async function pingServer() {
  try {
    console.log(`[${new Date().toISOString()}] Pinging server...`);
    const response = await fetch(URL);
    console.log(`[${new Date().toISOString()}] Ping successful: ${response.status}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Ping failed:`, error.message);
  }
}

module.exports = {
  pingServer
}