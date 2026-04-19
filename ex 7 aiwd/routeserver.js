const http = require("http");

const server = http.createServer((req, res) => {
  const name = "J Denis Isaac Paul"; // Replace with your name
  
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<h2>Hello from ${name}'s Node.js Server</h2>`);
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h2>About Page</h2>");
    res.write("<p>This server is created using Node.js</p>");
  } else if (req.url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h2>Contact Page</h2>");
    res.write("<p>Email: yourname@example.com</p>");
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write("<h2>404 - Page Not Found</h2>");
  }
  
  res.end();
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3000");
});
