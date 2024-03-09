const connectToDatabase = require("../config/Connect");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = connectToDatabase();

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Thực hiện câu truy vấn để lấy mật khẩu đã được mã hóa từ cơ sở dữ liệu
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                res.status(500).send("Internal Server Error");
                return;
            }
            if (result.length === 0) {
                res.status(401).send("Invalid credentials");
                return;
            }

            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) {
                    res.status(500).send("Internal Server Error");
                    return;
                }
                if (isMatch) {
                    const token = jwt.sign(
                        { username: username },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1h",
                        }
                    );

                    res.status(200).json({ success: true, token: token });
                } else {
                    res.status(401).send("Invalid credentials");
                }
            });
        }
    );
};

exports.register = (req, res) => {
    const { name, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res
            .status(400)
            .send("Password and confirm password do not match");
    }

    // Mã hóa mật khẩu
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            db.query(
                "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
                [name, username, hash],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).send("Internal Server Error");
                    }
                    if (result.affectedRows === 1) {
                        return res
                            .status(200)
                            .send("User successfully registered");
                    } else {
                        return res.status(500).send("Failed to register user");
                    }
                }
            );
        });
    });
};

exports.getUserProfile = (req,res)=>{
    console.log("token được xác nhận")
}
