const app = require("./app");
const { server } = require("./lib/socket");
const port = process.env.PORT || 3000;

// const server = http.Server(app);

// initializeSocket(server);

server.listen(port, () => {
  console.log(`server is running on port no. ${port}`);
});
