const http = require("http");
const fs = require("fs");
const axios = require("axios");

// Read the HTML file
const happy = fs.readFileSync("index.html", "utf-8");

// Define replaceVal function
const replaceVal = (tempval, orgval) => {
  let temperature = tempval.replace("{%tempmin%}", (orgval.main.temp_min - 273.15).toFixed(2));
  temperature = temperature.replace("{%value%}", (orgval.main.temp - 273.15).toFixed(2));
  temperature = temperature.replace("{%tempmax%}", (orgval.main.temp_max - 273.15).toFixed(2));
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);
  temperature = temperature.replace("{%status%}", orgval.weather[0].main);
  return temperature;
};

// Create the server
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    axios.get("https://api.openweathermap.org/data/2.5/weather?q=bhadrak&appid=50f8392da4bf71cca6b3065ba95d7d22")
      .then((response) => {
        const objData = response.data;
        const arrayData = [objData];
        const realTimeData = arrayData.map((val) => replaceVal(happy, val)).join(" ");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(realTimeData);
        res.end();
      })
      .catch((error) => {
        console.error("Error:", error.message);
        res.writeHead(500, { "Content-Type": "text/html" });
        res.write("<h1>Internal Server Error</h1>");
        res.end();
      });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write("<h1>Page Not Found</h1>");
    res.end();
  }
});

// Start the server
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
