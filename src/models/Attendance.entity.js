const { pool } = require("../dbconfig/dbconnect");

class Attendance {
  async getAll(id) {
    try {
      await pool.connect();
      const query = `SELECT * FROM public.counselee WHERE "currentCounselorId"='${id}';`;
      return await pool.query(query, id);
    } catch (error) {
      throw { error: error.message };
    }
  }
  async findCounselorById(id) {
    try {
      const query = `SELECT * FROM public.counselor WHERE id = $1 LIMIT 1;`;
      return await pool.query(query, [id]);
    } catch (error) {
      throw { error: error.message };
    }
  }
  async findSessionById(id) {
    try {
      const query = `SELECT * FROM public.scheduled_session WHERE id = $1 LIMIT 1;`;
      return await pool.query(query, [id]);
    } catch (error) {
      throw { error: error.message };
    }
  }
  async findRecordById(counselee, event) {
    try {
      const query = `SELECT * FROM public.counselee_prasadam
                     WHERE "counseleeId" = $1 AND "eventId" = $2;`;
      const values = [counselee, event];
      const result = await pool.query(query, values);

      return result; // or result if you need other metadata like rowCount
    } catch (error) {
      throw { error: error.message };
    }
  }
  async findCounseleeById(id) {
    try {
      const query = `SELECT * FROM public.counselee WHERE id = $1 LIMIT 1;`;
      return await pool.query(query, [id]);
    } catch (error) {
      throw { error: error.message };
    }
  }
  async findOneByPhone(phoneNumber) {
    try {
      const query = `SELECT * FROM public.counselee WHERE "phoneNumber" = $1 LIMIT 1;`;
      const values = [phoneNumber];
      return await pool.query(query, values);
    } catch (error) {
      throw { error: error.message };
    }
  }
  async record(counseleeId, receivedCount, eventId) {
    const client = await pool.connect();
    try {
      const query = `INSERT INTO public.counselee_prasadam("counseleeId", "recievedCount", "eventId")
                     VALUES($1, $2, $3)
                     RETURNING *;`; // Optional: RETURNING * to get the inserted record
      const values = [counseleeId, receivedCount, eventId];
      const result = await client.query(query, values);

      return result.rows[0]; // Return the inserted record
    } catch (error) {
      console.log(error);
      console.error("Error executing query", error.stack);
      return { error: error.message };
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  async updateReceivedCount(counseleeId, eventId, receivedCount) {
    try {
      const query = `UPDATE public.counselee_prasadam
                     SET "recievedCount" = $3
                     WHERE "counseleeId" = $1 AND "eventId" = $2
                     RETURNING *;`; // Optional: RETURNING * to get the updated record
      const values = [counseleeId, eventId, receivedCount];
      const result = await pool.query(query, values);
      return result; // Return the updated record
    } catch (error) {
      return { error: error.message };
    }
  }
  async updateDevoteeCount(counseleeId, eventId, declaredCount) {
    try {
      const query = `INSERT INTO public.counselee_prasadam("counseleeId", "eventId","declaredCount")
                     VALUES($1, $2, $4)
                     RETURNING *;`; // Optional: RETURNING * to get the inserted record
      const values = [counseleeId, eventId, declaredCount];
      const result = await pool.query(query, values);
      return result; // Return the updated record
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = Attendance;
