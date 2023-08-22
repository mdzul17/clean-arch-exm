const InvariantError = require("../../Commons/exceptions/InvariantError");
const AuthenticationRepository = require("../../Domains/authentications/AuthenticationRepository");

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1) RETURNING token",
      values: [token],
    };

    const result = await this._pool.query(query);

    return result;
  }

  async checkAvailabilityToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("Token tidak tersedia");
    }
  }

  async deleteToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    return result;
  }
}

module.exports = AuthenticationRepositoryPostgres;
