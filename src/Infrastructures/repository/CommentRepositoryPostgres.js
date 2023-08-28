const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const CommentRepository = require("../../Domains/comments/CommentsRepository");

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

  // async getCommentById(id) {
  //   const query = {
  //     text: "SELECT * FROM comments WHERE id = $1",
  //     values: [id],
  //   };
  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new NotFoundError("Comment tidak ditemukan!");
  //   }

  //   console.log(result);

  //   return result.rows[0];
  // }
}

module.exports = CommentRepositoryPostgres;
