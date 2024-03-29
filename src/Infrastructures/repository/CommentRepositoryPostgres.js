const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments(id, content, owner, thread_id) VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, payload.content, payload.owner, payload.thread_id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: "SELECT a.id, b.username, a.date, a.is_delete, a.content FROM comments a LEFT JOIN users b ON b.id = a.owner WHERE thread_id = $1 order by date asc",
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(id) {
    const query = {
      text: "UPDATE comments SET is_delete = 1 WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Comment tidak ditemukan!");
    }

    return result.rows;
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Comment tidak ditemukan");
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Comment tidak tersedia");
    }
  }

  async likeComment(user_id, thread_id, comment_id) {
    const query = {
      text: "INSERT INTO comment_likes VALUES($1, $2, $3) RETURNING comment_id",
      values: [user_id, thread_id, comment_id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async unlikeComment(user_id, thread_id, comment_id) {
    const query = {
      text: "DELETE FROM comment_likes WHERE user_id = $1 and thread_id = $2 and comment_id = $3 RETURNING comment_id",
      values: [user_id, thread_id, comment_id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getLikeCount(thread_id) {
    const query = {
      text: "SELECT comment_id, count(*) as like_count FROM comment_likes WHERE thread_id = $1 GROUP BY thread_id, comment_id",
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getLikes(thread_id) {
    const query = {
      text: "SELECT * FROM comment_likes WHERE thread_id = $1",
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
