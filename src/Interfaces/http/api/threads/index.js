const routes = require("./routes");
const ThreadsHandler = require("./handler");

module.exports = {
  name: "thread",
  register: async (server, { container }) => {
    const threadsHandler = ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};
