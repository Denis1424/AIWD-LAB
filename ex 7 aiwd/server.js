const http = require("http");

const server = http.createServer((req, res) => {
  const name = "J Denis Isaac Paul"; // replace with your name
  const currentTime = new Date();
  
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(`<h2>Hello from ${name}'s Node.js Server</h2>`);
  res.write(`<p>Current Date and Time: ${currentTime}</p>`);
  res.end();
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3000");
});
