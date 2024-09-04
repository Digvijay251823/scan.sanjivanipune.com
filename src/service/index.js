const { getUserWithPhone } = require("../controller");
const { pool } = require("../dbconfig/dbconnect");
const Attendance = require("../models/Attendance.entity");
const Event = require("../models/Event.entity");

exports.storeUserService = async function (formData) {
  let client;
  try {
    if (!formData.counselee || !formData.counselor || !formData.session) {
      throw new Error("data is invalid");
    }
    client = await pool.connect();
    const session = await new Attendance().findSessionById(formData.session);
    if (session.rows.length <= 0) {
      throw new Error("session not found");
    }
    const counselor = await new Attendance().findCounselorById(
      formData.counselor
    );
    if (counselor.rows.length <= 0) {
      throw new Error("Counselee not found");
    }
    const counselee = await new Attendance().findCounseleeById(
      formData.counselee
    );
    if (counselee.rows.length <= 0) {
      throw new Error("Counselee not found");
    }

    return {
      something: "this is the response",
      formData,
    };
  } catch (error) {
    throw new Error(error.message || error.title);
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getUserService = async function (phoneNumber) {
  let client;
  try {
    client = await pool.connect();

    const counselee = await new Attendance().findOneByPhone(phoneNumber);
    if (counselee.rows.length > 0) {
      return counselee.rows[0];
    } else {
      throw new Error("Counselee not found");
    }
    // return { something: "this is the response", formData };
  } catch (error) {
    throw new Error(error.message || error.title);
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getEventById = async function (id) {
  let client;
  try {
    client = await pool.connect();

    if (!id) {
      throw new Error("id not found");
    }
    const eventDetails = await new Event().getEventById(id);
    if (eventDetails.rows.length > 0) {
      return eventDetails.rows[0];
    } else {
      throw new Error("event not found");
    }
  } catch (error) {
    throw new Error(error.message || error.title);
  } finally {
    if (client) {
      client.release();
    }
  }
};
