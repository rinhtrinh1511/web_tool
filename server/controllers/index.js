const connectToDatabase = require("../config/Connect");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = connectToDatabase();

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json("Tên đăng nhập và mật khẩu là bắt buộc");
    }

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                return res.status(500).json("Internal Server Error");
            }

            if (result.length === 0) {
                return res.status(401).json("Tài khoản không tồn tại");
            }
            const user = result[0];
            const name = user.name;
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json("Internal Server Error");
                }

                if (isMatch) {
                    const token = jwt.sign(
                        { username: username },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1h",
                        }
                    );

                    return res.status(200).json({
                        success: true,
                        name: name,
                        token: token,
                    });
                } else {
                    return res
                        .status(401)
                        .json("Thông tin đăng nhập không hợp lệ");
                }
            });
        }
    );
};

exports.register = (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("Email không hợp lệ.");
    }

    if (!username || !password) {
        return res.status(400).json("Tên đăng nhập và mật khẩu là bắt buộc");
    }

    if (password !== confirmPassword) {
        return res.status(400).send("Xác nhận mật khẩu lỗi.");
    }
    if (username.length < 6 || password.length < 6) {
        return res
            .status(400)
            .send("Tài khoản hoặc mật khẩu phải có ít nhất 6 kí tự");
    }
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, rows) => {
            if (err) {
                console.error("Error querying users:", err);
                return res.status(500).send("Internal Server Error");
            }
            if (rows.length > 0) {
                return res.status(400).send("Tài khoản đã tồn tại.");
            }
            // Mã hóa mật khẩu
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    db.query(
                        "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
                        [email, username, hash],
                        (err, result) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send("Internal Server Error");
                            }
                            if (result.affectedRows === 1) {
                                return res
                                    .status(200)
                                    .send("Đăng ký tài khoản thành công.");
                            } else {
                                return res
                                    .status(500)
                                    .send("Failed to register user");
                            }
                        }
                    );
                });
            });
        }
    );
};

exports.getUserProfile = (req, res) => {
    console.log("token được xác nhận");
};
