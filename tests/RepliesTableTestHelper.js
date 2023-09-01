/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addReply({
    id = "reply-123",
    owner = "user-123",
    content = "test content",
    comment_id = "comment-123",
    thread_id = "thread-123",
  }) {
    const query = {
      text: "INSERT INTO replies(id, content, owner, comment_id, thread_id) VALUES($1, $2, $3, $4, $5)",
      values: [id, content, owner, comment_id, thread_id],
    };

    await pool.query(query);
  },

  async getReplyById(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    return await pool.query("TRUNCATE TABLE replies CASCADE");
  },
};

module.exports = CommentsTableTestHelper;
