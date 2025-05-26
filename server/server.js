const app = require("./src/app");
const http = require("http");
const { initSocket } = require("./src/config/socket");

const port = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
