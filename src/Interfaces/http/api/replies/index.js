const routes = require("./routes");
const RepliesHandler = require("./handler");

module.exports = {
  name: "reply",
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};
