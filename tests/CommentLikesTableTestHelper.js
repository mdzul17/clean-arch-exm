/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentLikesTableTestHelper = {
  async addLike({
    user_id = "user-123",
    thread_id = "thread-123",
    comment_id = "comment-123",
  }) {
    const query = {
      text: "INSERT INTO comment_likes(user_id, thread_id, comment_id) VALUES($1, $2, $3)",
      values: [user_id, thread_id, comment_id],
    };

    await pool.query(query);
  },

  async getLikeCount({ thread_id = "thread-123", comment_id = "comment-123" }) {
    const query = {
      text: "SELECT count(comment_id) FROM comment_likes WHERE thread_id = $1 and comment_id = $2 GROUP BY thread_id, comment_id",
      values: [thread_id, comment_id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    return await pool.query("DELETE FROM comment_likes");
  },
};

module.exports = CommentLikesTableTestHelper;
