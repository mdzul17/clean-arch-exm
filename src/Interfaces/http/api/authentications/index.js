const routes = require("./routes");
const AuthenticationsHandler = require("./handler");

module.exports = {
  name: "authentication",
  register: async (server, { container }) => {
    const authenticationsHandler = AuthenticationsHandler(container);
    server.route(routes(authenticationsHandler));
  },
};
