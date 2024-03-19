const connectToDatabase = require("../config/Connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = connectToDatabase();
const axios = require("axios");
const md5 = require("md5");
const { format } = require("date-fns");

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
      bcrypt.compare(password, result[0].password, (err, isMatch) => {
        if (err) {
          return res.status(500).jFson("Internal Server Error");
        }

        if (isMatch) {
          const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          return res.status(200).json({
            success: true,
            user: {
              id: user.id,
              email: user.name,
              name: user.username,
              created_at: user.created_at,
              usd: user.usd,
            },
            token,
          });
        } else {
          return res.status(401).json("Thông tin đăng nhập không hợp lệ");
        }
      });
    }
  );
};

exports.register = (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  const uuid = require("uuid");
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

  const keyId = uuid.v4();

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

      // Kiểm tra xem keyId đã tồn tại trong cơ sở dữ liệu chưa
      db.query(
        "SELECT * FROM users WHERE key_secret = ?",
        [keyId],
        (err, keyRows) => {
          if (err) {
            console.error("Error querying users:", err);
            return res.status(500).send("Internal Server Error");
          }
          while (keyRows.length > 0) {
            keyId = uuid.v4();
            keyRows = db.query("SELECT * FROM users WHERE key_secret = ?", [
              keyId,
            ]);
          }
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              db.query(
                "INSERT INTO users (name, username, password, key_secret) VALUES (?, ?, ?, ?)",
                [email, username, hash, keyId],
                (err, result) => {
                  if (err) {
                    return res.status(500).send("Internal Server Error");
                  }
                  if (result.affectedRows === 1) {
                    return res
                      .status(200)
                      .send("Đăng ký tài khoản thành công.");
                  } else {
                    return res.status(500).send("Failed to register user");
                  }
                }
              );
            });
          });
        }
      );
    }
  );
};

exports.getUserProfile = (req, res) => {
  console.log("token được xác nhận");
};

exports.getTool = (req, res) => {
  db.query("SELECT * FROM tools ", (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No tools found");
    }
  });
};
exports.getToolDetail = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM tools WHERE id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No tools found");
    }
  });
};

exports.getVPS = (req, res) => {
  db.query("SELECT * FROM vps ", (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No tools found");
    }
  });
};

exports.getVPSDetail = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM vps WHERE id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No vps found");
    }
  });
};

exports.getUSD = (req, res) => {
  const userID = req.params.userID;
  db.query("SELECT usd FROM users WHERE id = ?", [userID], (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No vps found");
    }
  });
};

exports.purchase = (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;
  const discount = req.body.discount;
  const category = req.body.category;

  const getUserQuery = `SELECT * FROM users WHERE id = ${userId}`;
  const getProductQuery = `SELECT * FROM ${category} WHERE id = ${productId}`;
  const getDiscount = `SELECT * FROM discount WHERE name = ${discount}`;

  db.query(getUserQuery, (err, userResult) => {
    if (err) {
      res.status(500).json({ error: "Vui lòng đăng nhập để tiếp tục" });
      return;
    }

    if (userResult.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = userResult[0];
    db.query(getProductQuery, (err, productResult) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
        console.log(err);
        return;
      }

      if (productResult.length === 0) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const product = productResult[0];

      if (user.usd < product.price) {
        const shortVND = product.price - user.usd;
        res.status(403).json({
          error: `Số dư không đủ\ncòn thiếu ${shortVND.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`,
        });
        return;
      }

      if (discount) {
        db.query(getDiscount, (err, discountResult) => {
          if (err) {
            res.status(500).json({
              error: "Internal server error",
            });
            return;
          }

          if (discountResult.length === 0) {
            res.status(404).json({ error: "Discount not found" });
            return;
          }

          const discount = discountResult[0];

          if (discount.remaining_usage < 1) {
            res.status(404).json({
              error: "Mã giảm giá đã hết lượt sử dụng",
            });
            return;
          }
          if (user.usd < product.price) {
            res.status(403).json({
              error: "Số dư không đủ, vui lòng nạp thêm.",
            });
            return;
          }

          const newBalance =
            user.usd -
            (product.price - (product.price * discount.total_discount) / 100);
          discount.remaining_usage--;
          const updateBalanceQuery = `UPDATE users SET usd = ${newBalance} WHERE id = ${userId}`;
          const updateDiscount = `UPDATE discount SET remaining_usage = ${discount.remaining_usage} `;
          db.query(updateDiscount, (err, updateResult) => {
            if (err) {
              res.status(500).json({
                error: "Internal server error",
              });
              return;
            }
          });
          db.query(updateBalanceQuery, (err, updateResult) => {
            if (err) {
              res.status(500).json({
                error: "Internal server error",
              });
              return;
            }

            res.json({
              success: true,
              user: {
                id: user.id,
                email: user.name,
                name: user.username,
                created_at: user.created_at,
                usd: newBalance,
              },
            });
          });
        });
      } else {
        if (user.usd < product.price) {
          res.status(403).json({
            error: "Số dư không đủ, vui lòng nạp thêm.",
          });
          return;
        }

        const newBalance = user.usd - product.price;
        const updateBalanceQuery = `UPDATE users SET usd = ${newBalance} WHERE id = ${userId}`;

        db.query(updateBalanceQuery, (err, updateResult) => {
          if (err) {
            res.status(500).json({
              error: "Internal server error",
            });
            return;
          }

          res.json({
            success: true,
            user: {
              id: user.id,
              email: user.name,
              name: user.username,
              created_at: user.created_at,
              usd: newBalance,
            },
          });
        });
        const currentdate = new Date();
        const formattedDate = format(currentdate, "yyyy-MM-dd HH:mm:ss");
        const updateHistory = `INSERT INTO history (id_user, code, total, time, download, discount, category, status) 
                        VALUES (${userId}, ${product.id}, ${
          product.price
        }, '${formattedDate}', 1, ${true}, '${category}', 'Thành công')`;
        db.query(updateHistory, (err, historyResult) => {
          if (err) {
            res.status(500).json({
              error: "Internal server error",
            });
            return;
          }
        });
      }
    });
  });
};

exports.getDiscount = (req, res) => {
  const getDiscountQuery = `SELECT * FROM discount`;
  db.query(getDiscountQuery, (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No tools found");
    }
  });
};

exports.topUpTheSieuRe = async (req, res) => {
  const { telco, code, serial, amount } = req.body;
  if (!telco || !code || !serial || !amount) {
    return res.status(401).send("vui lòng nhập đầy đủ thông tin");
  }
  if (/^D/.test(serial)) {
    return res.status(401).send("Seri của bạn phải là số 100% và không có chữ");
  }
  if (/^D/.test(code)) {
    return res
      .status(401)
      .send("Mã thẻ của bạn phải là số 100% và không có chữ");
  }

  const partner_key = "684323a9d5782e0e5c34e6c6a8703bab";
  const partner_id = "69371830711";
  const request_id =
    Math.floor(Math.random() * (9999999999 - 1111111111 + 1)) + 1111111111;
  const url = `https://thesieure.com/chargingws/v2?sign=${md5(
    partner_key + code + serial
  )}&telco=${telco}&code=${code}&serial=${serial}&amount=${amount}&request_id=${request_id}&partner_id=${partner_id}&command=charging`;

  try {
    const response = await axios.post(url);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.History = async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const getHistory = `SELECT * FROM history WHERE id_user=${id}`;
  db.query(getHistory, (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No History found");
    }
  });
};
