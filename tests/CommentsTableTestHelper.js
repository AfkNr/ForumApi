/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommmetsTableTestHelper = {
  async addComment({
    id = 'comment-1234567890',
    threadId = 'thread-1234567890',
    owner = 'user-1234567890',
    content = 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
    isDelete = false,
    date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, owner, date, content, isDelete],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommmetsTableTestHelper;
