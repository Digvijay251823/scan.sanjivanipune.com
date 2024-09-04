const {
  storeUser,
  getUser,
  getUserWithPhone,
  getEventDetails,
  storeUserAttendance,
  getScanner,
  updateUserAttendance,
  authenticateCounselee,
  getConsent,
  getLogin,
  initiUpdateCounselee,
  getEntry,
  getSuccess,
} = require("../controller");

module.exports = async function (fastify, options) {
  fastify.post("/record", storeUserAttendance);
  fastify.get("/attendance", getEntry);
  fastify.post("/initupdate", initiUpdateCounselee);
  fastify.put("/update", updateUserAttendance);
  fastify.post("/:id", storeUser);
  fastify.post("/barcode", getUserWithPhone);
  fastify.post("/authenticate", authenticateCounselee);
  fastify.get("/event/:id", getEventDetails);
  fastify.get("/:eventid", getUser);
  fastify.get("/success", getSuccess);
  fastify.get("/consent", getConsent);
  fastify.get("/login", getLogin);
  fastify.get("/scanner", getScanner);
};
