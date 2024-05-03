const { Signature } = require("./hwei");

const authMiddleware = async (req, res, next) => {
  try {
    const route = req.path;
    const toolPathRegex = /^\/tool\/\d+$/;
    const vpsPathRegex = /^\/vps\/\d+$/;
    if (
      route === "/login" ||
      route === "/register" ||
      route === "/tools" ||
      route === "/vps" ||
      route === "/discount" ||
      toolPathRegex.test(route) ||
      vpsPathRegex.test(route)
    ) {
      return next();
    }
    const token = req.headers.authorization?.slice(7);
    if (!token) {
      return res.status(403).json({
        ok: false,
        message: "Không có quyền truy cập",
      });
    }
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    if (!encodedHeader || !encodedPayload) {
      throw new Error("Token không hợp lệq");
    }
    const header = Buffer.from(encodedHeader, "base64").toString("utf8");
    const payload = Buffer.from(encodedPayload, "base64").toString("utf8");
    const { exp } = JSON.parse(payload);
    if (!(signature === Signature(encodedHeader, encodedPayload))) {
      return res.status(403).send({
        ok: false,
        message: "Token không hợp lệ",
      });
    }
    if (exp < Math.floor(Date.now() / 1000)) {
      return res.status(403).send({
        ok: false,
        message: "Token đã hết hạn",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      ok: false,
      message: "Lỗi xác thực",
    });
  }
};

module.exports = authMiddleware;
