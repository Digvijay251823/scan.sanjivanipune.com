const {
  storeUserService,
  getUserService,
  getEventById,
} = require("../service");
const path = require("path");
const fs = require("fs");
const Event = require("../models/Event.entity");
const Attendance = require("../models/Attendance.entity");
const { pool } = require("../dbconfig/dbconnect");

exports.storeUser = async function (req, res) {
  const { counseleeId, sessionId, counselorId } = req.body;
  const formData = {
    counselee: counseleeId,
    session: sessionId,
    counselor: counselorId,
  };
  return await storeUserService(formData);
};

exports.getUserWithPhone = async function (req, res) {
  const { phoneNumber, declaredCount } = req.body;
  return await getUserService(phoneNumber, declaredCount);
};

exports.getUser = async function (req, res) {
  const filePath = path.join(__dirname, "../../", "views", "index.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");
  res.type("text/html").send(htmlContent);
};
exports.getScanner = async function (req, res) {
  const filePath = path.join(__dirname, "../../", "views", "scanner2.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");
  res.type("text/html").send(htmlContent);
};
exports.getLogin = async function (req, res) {
  const filePath = path.join(__dirname, "../../", "views", "login.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");
  res.type("text/html").send(htmlContent);
};
exports.getSuccess = async function (req, res) {
  const filePath = path.join(__dirname, "../../", "views", "success.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");
  res.type("text/html").send(htmlContent);
};
exports.getConsent = async function (req, res) {
  const filePath = path.join(__dirname, "../../", "views", "consent.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");
  res.type("text/html").send(htmlContent);
};

exports.getEventDetails = async function (req, res) {
  const { id } = req.params;
  return await getEventById(id);
};

exports.storeUserAttendance = async function (req, res) {
  const { counseleeId, eventId } = req.body;
  let client;
  try {
    client = await pool.connect();
    if (!counseleeId || !eventId) {
      return res.code(400).send({ message: "data is invalid" });
    }
    const event = await new Event().getEventById(eventId);
    if (event.rows.length <= 0) {
      return res.code(400).send({ message: "event not found" });
    }

    const counselee = await new Attendance().findCounseleeById(counseleeId);

    if (counselee.rows.length <= 0) {
      return res.code(400).send({ message: "Counselee not found" });
    }
    const getExistingRecord = await new Attendance().findRecordById(
      counseleeId,
      eventId
    );

    if (getExistingRecord.rows.length <= 0) {
      await new Attendance().record(counseleeId, 1, eventId);
      return res.code(200).send({
        message: "counselee prasadam confirmed",
      });
    } else {
      return res
        .code(409)
        .send({ message: "already taken prasadam do you want to allow again" });
    }
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};
exports.updateUserAttendance = async function (req, res) {
  const { counseleeId, eventId } = req.body;
  let client;
  try {
    client = await pool.connect();
    if (!counseleeId || !eventId) {
      return res.code(400).send({ message: "data is invalid" });
    }
    const event = await new Event().getEventById(eventId);
    if (event.rows.length <= 0) {
      return res.code(400).send({ message: "event not found" });
    }

    const counselee = await new Attendance().findCounseleeById(counseleeId);

    if (counselee.rows.length <= 0) {
      return res.code(400).send({ message: "Counselee not found" });
    }
    const getExistingRecord = await new Attendance().findRecordById(
      counseleeId,
      eventId
    );
    const recievedCount = getExistingRecord.rows[0].recievedCount;
    if (getExistingRecord.rows.length > 0) {
      await new Attendance().updateReceivedCount(
        counseleeId,
        eventId,
        recievedCount + 1
      );
      return res.code(200).send({
        message: "counselee received prasadam",
      });
    } else {
      return res.code(400).send({ message: "counselee Not Found" });
    }
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};
exports.initiUpdateCounselee = async function (req, res) {
  const { counseleeId, eventId, declaredCount } = req.body;

  let client;
  try {
    client = await pool.connect();
    if (!declaredCount) {
      return res.code(400).send({ message: "declared count is required" });
    }
    if (!counseleeId || !eventId || !declaredCount) {
      return res.code(400).send({ message: "data is invalid" });
    }
    const event = await new Event().getEventById(eventId);
    if (event.rows.length <= 0) {
      return res.code(400).send({ message: "event not found" });
    }

    const counselee = await new Attendance().findCounseleeById(counseleeId);

    if (counselee.rows.length <= 0) {
      return res.code(400).send({ message: "Counselee not found" });
    }

    const getExistingRecord = await new Attendance().findRecordById(
      counseleeId,
      eventId
    );

    if (getExistingRecord.rows.length <= 0) {
      const getExistingRecord = await new Attendance().updateDevoteeCount(
        counseleeId,
        eventId,
        declaredCount
      );
      return res.code(200).send({
        message: "registered",
        data: getExistingRecord.rows[0],
      });
    }

    return res.code(200).send({
      message: "updated",
      data: getExistingRecord.rows[0],
    });
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getEntry = async function (req, res) {
  try {
    const { counseleeId, eventId } = req.query;
    const getExistingRecord = await new Attendance().findRecordById(
      counseleeId,
      eventId
    );
    console.log(getExistingRecord);
    return res.code(200).send({ data: getExistingRecord.rows[0] });
  } catch (error) {
    return res.code(500).send({ message: error.message });
  }
};

// try {
//   client = await pool.connect();
//   if (!counseleeId || !eventId) {
//     return res.code(400).send({ message: "data is invalid" });
//   }
//   const event = await new Event().getEventById(eventId);
//   if (event.rows.length <= 0) {
//     return res.code(400).send({ message: "event not found" });
//   }
//   const counselee = await new Attendance().findCounseleeById(counseleeId);
//   if (counselee.rows.length <= 0) {
//     return res.code(404).send({ message: "Counselee not found" });
//   }
//   const getExistingRecord = await new Attendance().findRecordById(
//     counseleeId,
//     eventId
//   );
//   if (getExistingRecord.rows.length > 0) {
//     await new Attendance().updateReceivedCount(
//       counseleeId,
//       eventId,
//       getExistingRecord + 1
//     );
//     return res.code(200).send({
//       message: "Updated the details of counselee prasadam",
//     });
//   }
// } catch (error) {
//   return res.code(500).send({ message: error.message });
// } finally {
//   if (client) {
//     client.release();
//   }
// }

exports.authenticateCounselee = async function (req, res) {
  const { phoneNumber, password } = req.body;
  try {
    const counselee = await new Attendance().findOneByPhone(phoneNumber);

    if (counselee.rows.length <= 0) {
      return req
        .code(401)
        .send({ message: "counselee not found with this number" });
    }
    if (counselee?.isEventManager || counselee?.isEventManager === true) {
      return res
        .code(401)
        .send({ message: "you do not have access to this resource" });
    }
    return res.code(200).send({
      message: "authenticated ",
      user_name: `${counselee?.rows[0]?.firstName} ${counselee?.rows[0]?.lastName}`,
      phoneNumber: counselee?.rows[0]?.phoneNumber,
      id: counselee?.rows[0]?.id,
    });
  } catch (error) {
    return req.code(500).send({ message: error.message });
  }
};
