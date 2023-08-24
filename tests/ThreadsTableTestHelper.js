/* instabul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread(payload) {
    const { title, body } = payload;
    const query = {
      text: "INSERT INTO threads VALUES($1, $2)",
      values: [title, body],
    };

    await pool.query(query);
  },

  async getThreads() {
    return await pool.query("SELECT * FROM threads");
  },

  async getThreadById(id) {
    const getThreadQuery = {
      text: "SELECT id, title, body, posting_date as date, b.username FROM threads a INNER JOIN users b ON a.owner = b.id WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(getThreadQuery);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE authentications");
  },
};

module.exports = ThreadsTableTestHelper;
