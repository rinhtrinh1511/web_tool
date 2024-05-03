const jwt = require("jsonwebtoken");
const { Signature } = require("./hwei");

const authenticateToken = (encodeHeader, encodePayload, sign) => {
  const header = Buffer.from(encodeHeader, "base64").toString("utf8");
  const payload = Buffer.from(encodePayload, "base64").toString("utf8");
  const data = JSON.parse(payload);
  if (!(sign === Signature(encodeHeader, encodePayload))) {
    return res.status(403).send({
      ok: false,
      message: "Đoán xem lỗi gì",
    });
  }
};

module.exports = authenticateToken;
