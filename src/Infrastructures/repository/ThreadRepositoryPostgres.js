const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const PostedThread = require("../../Domains/threads/entities/PostedThread");
const ThreadsRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadsRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const { title, body, owner } = payload;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new PostedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: "SELECT a.id, a.title, a.body, b.username, a.date FROM threads a LEFT JOIN users b ON b.id = a.owner WHERE a.id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Thread tidak ditemukan!");
    }

    return result.rows[0];
  }

  async verifyThreadAvailability(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Thread tidak tersedia");
    }
  }
}

module.exports = ThreadRepositoryPostgres;
