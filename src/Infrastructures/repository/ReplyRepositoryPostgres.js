const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload) {
    const { content, thread_id, comment_id, owner } = payload;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies (id, content, thread_id, comment_id, owner) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, thread_id, comment_id, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteReply(id) {
    const query = {
      text: "UPDATE replies SET is_delete = 1 WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Reply tidak ditemukan!");
    }

    return result.rows;
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Reply tidak ditemukan");
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async getReplyByThreadId(thread_id) {
    const query = {
      text: "SELECT a.id, b.username, a.date, a.is_delete, a.content, a.comment_id FROM replies a LEFT JOIN users b ON b.id = a.owner WHERE thread_id = $1 order by date asc",
      values: [thread_id],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyReplyAvailability(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Reply tidak tersedia");
    }
  }
}

module.exports = ReplyRepositoryPostgres;
