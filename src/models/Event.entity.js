const { pool } = require("../dbconfig/dbconnect");

class Event {
  async getEventById(id) {
    try {
      const query = `SELECT * FROM public.temple_event WHERE id = $1 LIMIT 1;`;
      return await pool.query(query, [id]);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

module.exports = Event;
