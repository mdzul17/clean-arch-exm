/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    owner = "user-123",
    content = "test content",
    thread_id = "thread-123",
  }) {
    const query = {
      text: "INSERT INTO comments(id, content, owner, thread_id) VALUES($1, $2, $3, $4)",
      values: [id, content, owner, thread_id],
    };

    await pool.query(query);
  },

  async getCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    return await pool.query("TRUNCATE TABLE comments");
  },
};

module.exports = CommentsTableTestHelper;
