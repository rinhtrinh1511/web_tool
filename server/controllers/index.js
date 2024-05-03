const connectToDatabase = require("../config/Connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = connectToDatabase();
const axios = require("axios");
const md5 = require("md5");
const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const crypto = require("crypto");
const { Signature } = require("../middlewares/hwei");

require("dotenv").config();

let session = "";
const date = new Date();

const year = date.getFullYear().toString().padStart(4, "0");
const month = (date.getMonth() + 1).toString().padStart(2, "0");
const day = date.getDate().toString().padStart(2, "0");
const hours = date.getHours().toString().padStart(2, "0");
const minutes = date.getMinutes().toString().padStart(2, "0");
const seconds = date.getSeconds().toString().padStart(2, "0");
let milliseconds = date.getMilliseconds().toString();
milliseconds = milliseconds.slice(0, 3).padEnd(3, "0");
let refNo = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

// if (timestamp.length > 16) {
//   timestamp = timestamp.slice(0, 16);
// } else if (timestamp.length < 16) {
//   timestamp = timestamp.padEnd(16, "0");
// }

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
          if (user.role === 1) {
            const ip =
              req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            if (ip !== user.ip) {
              return res.status(401).json("Không thể đăng nhập từ IP này");
            }
          }

          const header = {
            alg: "HS256",
            typ: "JWT",
          };
          // Encode the header to Base64Url
          const encodedHeader = Buffer.from(JSON.stringify(header))
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

          const payload = {
            key: user.key_id,
            session: user.sessionID,
            exp: Date.now() + 360000,
          };
          // Encode the payload to Base64Url
          const encodedPayload = Buffer.from(JSON.stringify(payload))
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

          const hmac = crypto.createHmac("sha256", process.env.JWT_SECRET);

          // Generate the signature in Base64Url
          const signature = hmac
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
          const hwei = Signature(encodedHeader, encodedPayload);
          const jwtToken = `${encodedHeader}.${encodedPayload}.${hwei}`;

          const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          db.query(
            "UPDATE users SET sessionID = ? WHERE username = ?",
            [refNo, username],
            (err, result) => {
              if (err) {
                return res.status(500).json("Internal Server Error");
              }

              return res.status(200).json({
                success: true,
                user: {
                  id: user.id,
                  email: user.name,
                  name: user.username,
                  created_at: user.created_at,
                  key: user.key_id,
                },
                token,
                jwtToken,
              });
            }
          );
        } else {
          return res.status(401).json("Thông tin đăng nhập không hợp lệ");
        }
      });
    }
  );
};

exports.getInfo = (req, res) => {
  const token = req.headers.authorization?.slice(7);
  if (!token) {
    return;
  }
  const [encodeHeader, encodePayload, sign] = token.split(".");
  const header = Buffer.from(encodeHeader, "base64").toString("utf8");
  const payload = Buffer.from(encodePayload, "base64").toString("utf8");
  const data = JSON.parse(payload);
  db.query(
    `SELECT * FROM users WHERE key_id= ? `,
    [parseInt(data.key)],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send(result[0]);
    }
  );
};

exports.logout = (req, res) => {
  const session = req.cookies.session;
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  // Trả về phản hồi
  res.status(200).json({ success: true, message: "Đã đăng xuất" });
};

function mixCase(str) {
  return str
    .split("")
    .map((char) =>
      Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
    )
    .join("");
}

exports.register = (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  const key_id =
    Math.floor(Math.random() * (9999999999 - 1111111111 + 1)) + 1111111111;
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

  const secret = mixCase(uuidv4().replace(/-/g, "").substr(0, 20));

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, rows) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length > 0) {
        return res.status(400).send("Tài khoản đã tồn tại.");
      }

      db.query(
        "SELECT * FROM users WHERE secret = ?",
        [secret],
        (err, secretRows) => {
          if (err) {
            return res.status(500).send("Internal Server Error");
          }
          if (secretRows.length > 0) {
            // Nếu secret đã tồn tại, tạo secret mới và kiểm tra lại
            return register(req, res); // Gọi lại hàm register để thử lại với secret mới
          }

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              db.query(
                "INSERT INTO users (name, username, password, key_id, secret) VALUES (?, ?, ?, ?, ?)",
                [email, username, hash, key_id, secret],
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
  const token = req.headers.authorization?.slice(7);
  const id = req.params.id;
  if (!token) {
    return res.status(403).json({
      ok: false,
      message: "Không có quyền truy cập",
    });
  }
  db.query("SELECT usd FROM users WHERE key_id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows[0]);
    } else {
      return res.status(404).send("No vps found");
    }
  });
};

exports.purchase = (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;
  const discount_client = req.body.discount;
  const category = req.body.category;

  const token = req.headers.authorization?.slice(7);
  if (!token) {
    return res.status(403).json({
      ok: false,
      message: "Không có quyền truy cập",
    });
  }
  const tokenParts = token.split(".");
  const payload = Buffer.from(tokenParts[1], "base64").toString("utf8");
  const { key } = JSON.parse(payload);
  const getUserQuery = `SELECT * FROM users WHERE key_id = ${key}`;
  const getProductQuery = `SELECT * FROM ${category} WHERE id = ${productId}`;
  const getDiscount = `SELECT * FROM discount WHERE name = "${discount_client}"`;

  db.query(getUserQuery, (err, userResult) => {
    if (err) {
      return res.status(500).json({ error: "Vui lòng đăng nhập để tiếp tục" });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult[0];
    db.query(getProductQuery, (err, productResult) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error1" });
      }

      if (productResult.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = productResult[0];

      if (user.usd < product.price) {
        const shortVND = product.price - user.usd;
        return res.send(
          `Số dư không đủ\ncòn thiếu ${shortVND.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`
        );
      }

      if (discount_client) {
        db.query(getDiscount, (err, discountResult) => {
          if (err) {
            return res.status(500).json({
              error: "Internal server error 1",
            });
          }

          if (discountResult.length === 0) {
            return res.status(404).json({ error: "Discount not found" });
          }

          const discount = discountResult[0];
          if (discount.remaining_usage < 1) {
            return res.status(404).json({
              error: "Mã giảm giá đã hết lượt sử dụng",
            });
          }
          if (user.usd < product.price) {
            return res.status(403).json({
              error: "Số dư không đủ, vui lòng nạp thêm.",
            });
          }

          const newBalance =
            user.usd -
            (product.price - (product.price * discount.total_discount) / 100);
          discount.remaining_usage--;
          const updateBalanceQuery = `UPDATE users SET usd = ${newBalance} WHERE id = ${userId}`;
          const updateDiscount = `UPDATE discount SET remaining_usage = ${discount.remaining_usage} `;
          const updateHistory = `INSERT INTO history (id_user, code, total, time, download, discount, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          const values = [
            userId,
            productId,
            product.price,
            1,
            1,
            1,
            category,
            1,
          ];
          db.query(updateDiscount, (err, updateResult) => {
            if (err) {
              return res.status(500).json({
                error: "Internal server error",
              });
            }
          });
          db.query(updateHistory, values, (err, success) => {
            if (err) {
              return res.status(500).json({
                error: "Internal server error",
              });
            }
            console.log("them vao lich su thanh cong");
          });
          db.query(updateBalanceQuery, (err, updateResult) => {
            if (err) {
              return res.status(500).json({
                error: "Internal server error",
              });
            }
            res.status(200).json("Thanh toán thành công");
          });
        });
      } else {
        if (user.usd < product.price) {
          return res.send("Số dư không đủ, vui lòng nạp thêm.");
        }

        const newBalance = user.usd - product.price;
        const updateBalanceQuery = `UPDATE users SET usd = ${newBalance} WHERE key_id = ${key}`;
        const currentdate = new Date();
        const formattedDate = format(currentdate, "yyyy-MM-dd HH:mm:ss");
        //const discountValue = discount ? 1 : 0; // Chuyển đổi giá trị boolean thành 0 hoặc 1
        console.log(userId);
        const updateHistory = `INSERT INTO history (id_user, code, total, time, download, discount, category, status) 
                    VALUES (${userId}, ${product.id}, ${
          product.price
        }, '${formattedDate}', 1, ${true}, '${category}', 'Thành công')`;

        db.query(updateBalanceQuery, (err, updateResult) => {
          if (err) {
            return res.status(500).json({
              error: "Internal server error2",
            });
          }
          db.query(updateHistory, (err, historyResult) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                error: "Internal server error",
              });
            }
            res.status(200).json("Thanh toán thành công");
          });
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
  const { telco, code, serial, amount, user_id, key_id } = req.body;
  const request_id =
    Math.floor(Math.random() * (9999999999 - 1111111111 + 1)) + 1111111111;
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

  const url = `https://thesieure.com/chargingws/v2?sign=${md5(
    partner_key + code + serial
  )}&telco=${telco}&code=${code}&serial=${serial}&amount=${amount}&request_id=${request_id}&partner_id=${partner_id}&command=charging`;
  const url_check = `https://thesieure.com/chargingws/v2?sign=${md5(
    partner_key + code + serial
  )}&telco=${telco}&code=${code}&serial=${serial}&amount=${amount}&request_id=${request_id}&partner_id=${partner_id}&command=check`;
  const currentdate = new Date();
  const formattedDate = format(currentdate, "yyyy-MM-dd HH:mm:ss");
  try {
    const response = await axios.post(url);
    if (response.data.status === 99) {
      const queryToup = `INSERT INTO topup (code, serial, user_id, time, status, declared_value, telco) VALUES ('${code}', '${serial}', '${key_id}', '${formattedDate}', '${response.data.status}', '${amount}', '${telco}')`;
      db.query(queryToup, (error, result) => {
        if (error) {
          console.error("Lỗi khi chèn dữ liệu:", error);
        } else {
          console.log("Dữ liệu đã được chèn thành công!");
        }
      });
      const checkStatus = async () => {
        try {
          const response1 = await axios.post(url_check);
          if (response1.data.status === 3 || response1.data.status === 1) {
            clearInterval(intervalId);
            const updateStatusQuery = `UPDATE topup SET status = ${response1.data.status}, amount=${response1.data.amount} WHERE code = '${code}' AND serial = '${serial}'`;
            db.query(updateStatusQuery, (updateError, updateResult) => {
              if (updateError) {
                console.error("Lỗi khi cập nhật trạng thái:", updateError);
              } else {
                console.log("Trạng thái đã được cập nhật thành công!");
                const getUserQuery = `SELECT usd FROM users WHERE key_id = ${key_id}`;
                db.query(getUserQuery, (err, userResult) => {
                  if (err) {
                    console.error(
                      "Lỗi khi truy vấn thông tin người dùng:",
                      err
                    );
                    return res.status(500).json("Internal Server Error");
                  }
                  const currentUserUSD = userResult[0].usd;
                  const newUSD = currentUserUSD + response1.data.amount;
                  const queryTopUpSuccess = `UPDATE users SET usd= ${newUSD} WHERE key_id=${key_id}`;
                  db.query(queryTopUpSuccess, (err, updateUser) => {
                    if (err) {
                      console.log("Lỗi cập nhật tiền: ", err);
                      return res.status(500).json("Internal Server Error");
                    } else {
                      console.log("Cộng tiền thành công");
                    }
                  });
                });
              }
            });
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái:", error);
        }
      };
      const intervalId = setInterval(checkStatus, 1000);
    } else {
      console.log("lỗi: ", response.data.status);
    }
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getHistoryTopup = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return;
  }
  const queryTopup = `SELECT * FROM topup WHERE user_id=${id}`;
  db.query(queryTopup, (err, rows) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    if (rows.length > 0) {
      rows.forEach((row) => {
        const date = new Date(row.time);
        const utcPlus7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        row.time = utcPlus7Date.toISOString();
      });
      return res.status(200).send(rows);
    } else {
      return;
    }
  });
};

exports.History = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return;
  }
  const getHistory = `SELECT * FROM history WHERE id_user=${id} ORDER BY time DESC`;
  db.query(getHistory, (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      rows.forEach((row) => {
        const date = new Date(row.time);
        const utcPlus7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        row.time = utcPlus7Date.toISOString();
      });
      return res.status(200).send(rows);
    } else {
      return;
    }
  });
};

exports.getSecret = (req, res) => {
  const id = req.params.id;
  const getSecret = `SELECT * FROM users WHERE key_id=${id}`;
  db.query(getSecret, (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      const secret = rows[0].secret;
      return res.status(200).send(secret);
    } else {
      return res.status(404).send("Secret not found");
    }
  });
};

exports.getHistoryMBBank1 = async (req, res) => {
  const taikhoanmb = "0969938892";
  const deviceIdCommon = "25t8r7t2-mbib-0000-0000-2024032020221908";
  const sessionId = session;
  const sotaikhoanmb = "0969938892";
  const date1 = new Date().toLocaleDateString("en-GB");
  const url =
    "https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history";

  const data = {
    accountNo: sotaikhoanmb,
    fromDate: date1,
    toDate: date1,
    deviceIdCommon,
    refNo: `0969938892-${timestamp}`,
    sessionId,
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Authorization:
          "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
        Connection: "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        Cookie:
          "_fbp=fb.2.1710940935356.1393287853; _ga_R3XMN343KH=GS1.1.1710940935.1.1.1710940976.19.0.0; _gid=GA1.3.2024419412.1712426582; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3457941770.7466.0000; BIGipServerk8s_online_banking_pool_9712=3457941770.61477.0000; _ga=GA1.3.68244822.1710940936; _gat_gtag_UA_205372863_2=1; _ga_T1003L03HZ=GS1.1.1712484171.12.1.1712484408.0.0.0; JSESSIONID=C65A10BDF744173539CC81C228B90598",
        Deviceid: "25t8r7t2-mbib-0000-0000-2024032020221908",
        Origin: "https://online.mbbank.com.vn",
        RefNo: `0969938892-${timestamp}`,
        Referer:
          "https://online.mbbank.com.vn/information-account/source-account",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
        "X-Request-Id": `0969938892-${timestamp}`,
        "elastic-apm-traceparent":
          "00-7bf5bd066dbadcfddff171ea6afa3427-794160bc61610395-01",
        "sec-ch-ua":
          '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    });
    const historyMB = response.data.transactionHistoryList;

    if (response.data.result.ok && session) {
      if (historyMB) {
        historyMB.forEach((transaction) => {
          let user_id;
          const str = transaction.description;
          const startIndex = str.indexOf("CUSTOMER") + "CUSTOMER".length + 1;
          const endIndex = str.indexOf(" ", startIndex);
          const result = str.substring(startIndex, endIndex).toLowerCase();

          const parts = str.split("Trace "); // Tách chuỗi theo "Trace "
          const lastPart = parts[parts.length - 1]; // Lấy phần tử cuối cùng sau khi tách chuỗi

          if (result.startsWith("Nap")) {
            user_id = result.split("Nap")[1];
            try {
              db.query(
                `SELECT description FROM mbbank WHERE description LIKE CONCAT('%', ?, '%') AND description LIKE CONCAT('%', ?, '%')`,
                [`%${user_id}%`, `%${lastPart}%`],
                (err, results) => {
                  if (err) {
                    console.log(err);
                  } else {
                    if (results.length == 0) {
                      const insertQuery = `INSERT INTO mbbank (postingDate, transactionDate, accountNo, creditAmount, debitAmount, currency, description, addDescription, availableBalance, beneficiaryAccount, refNo, benAccountName, bankName, benAccountNo, dueDate, docId, transactionType, pos, tracingType,status)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
                      `;
                      const values = [
                        transaction.postingDate,
                        transaction.transactionDate,
                        transaction.accountNo,
                        transaction.creditAmount,
                        transaction.debitAmount,
                        transaction.currency,
                        transaction.description,
                        transaction.addDescription,
                        transaction.availableBalance,
                        transaction.beneficiaryAccount,
                        transaction.refNo,
                        transaction.benAccountName,
                        transaction.bankName,
                        transaction.benAccountNo,
                        transaction.dueDate,
                        transaction.docId,
                        transaction.transactionType,
                        transaction.pos,
                        transaction.tracingType,
                        0,
                      ];
                      db.query(insertQuery, values, (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                        }
                      });
                      db.query(
                        `SELECT creditAmount FROM mbbank WHERE description LIKE ? AND status = 0`,
                        [`%${user_id}%`],
                        (err, data) => {
                          if (err) {
                            console.log(err);
                            return;
                          }
                          if (data.length > 0) {
                            data.map((credit) => {
                              console.log(credit);
                              db.query(
                                `SELECT usd FROM users WHERE key_id = ${user_id}`,
                                (err, reslut) => {
                                  if (err) {
                                    console.log("Không tìm thấy user");
                                  } else {
                                    const newUsds =
                                      reslut[0].usd + credit.creditAmount;
                                    console.log(newUsds);
                                    db.query(
                                      `UPDATE users SET usd = ? WHERE key_id = ? `,
                                      [newUsds, parseInt(user_id)],
                                      (err, success) => {
                                        if (err) {
                                          console.log("Lỗi cộng tiền", err);
                                        } else {
                                          console.log("Cộng tiền thành công");
                                          db.query(
                                            `UPDATE mbbank SET status = ${1}`
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            });
                          } else {
                            console.log("Không có dữ liệu mới");
                          }
                        }
                      );
                    }
                  }
                }
              );
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    } else {
      console.log("Session hết hạn");
      AutoGetSession(timestamp);
    }
    res.send(response.data);
  } catch (error) {
    res.json("Session hết hạn vui lòng chờ khi đến hệ thống được nạp lại");
    AutoGetSession(timestamp);
    console.error(error.response.data);
  }
};

const AutoGetSession = (timestamp) => {
  let captcha;
  try {
    axios
      .post(
        "https://online.mbbank.com.vn/api/retail-web-internetbankingms/getCaptchaImage",
        {
          refNo: timestamp,
          deviceIdCommon: "25t8r7t2-mbib-0000-0000-2024032020221908",
          sessionId: "",
        },
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            Authorization:
              "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
            Connection: "keep-alive",
            "Content-Type": "application/json; charset=UTF-8",
            Cookie:
              "MBAnalyticsaaaaaaaaaaaaaaaa_session_=JOMJBHNMHBAEMJMDKDFIEIHBFLPOFFCOBAKMJGIPMBPPFLFNOCAKFODGAHFNAIGGJIJDKDFCPBEGIBBJLELANGODIHABCDEGDOLMEDMAELPKGEKFGFLLEPCFGICGBJEK; _fbp=fb.2.1710940935356.1393287853; _ga_R3XMN343KH=GS1.1.1710940935.1.1.1710940976.19.0.0; _gid=GA1.3.2024419412.1712426582; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3457941770.7466.0000; BIGipServerk8s_online_banking_pool_9712=3457941770.61477.0000; JSESSIONID=6A5EEA17D3721332B0ECF12E843E4517; _ga_T1003L03HZ=GS1.1.1712484171.12.1.1712484832.0.0.0; _ga=GA1.3.68244822.1710940936; _gat_gtag_UA_205372863_2=1",

            Deviceid: "25t8r7t2-mbib-0000-0000-2024032020221908",
            Origin: "https://online.mbbank.com.vn",
            RefNo: timestamp,
            Referer: "https://online.mbbank.com.vn/pl/login?logout=1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
            "X-Request-Id": timestamp,
            "elastic-apm-traceparent":
              "00-579aaeeaf63ef71e9dab992a5ada9e83-85851031adeee639-01",
            "sec-ch-ua":
              '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
          },
        }
      )
      .then((response) => {
        const base64_string = response.data.imageString;
        axios
          .post("http://localhost:5000/api/extract_text", { base64_string })
          .then((data) => {
            captcha = data.data.text;
            if (captcha) {
              const requestData = {
                userId: "0969938892",
                password: "6fc30e0ee1a0aa8a7464f137e0fa3067",
                captcha: captcha,
                ibAuthen2faString: "69835bd3a528aab3e1bf6d440ed433be",
                sessionId: null,
                refNo: `d7965ec4454b82a0cf4bdf456e528cb1-${timestamp}`,
                deviceIdCommon: "25t8r7t2-mbib-0000-0000-2024032020221908",
              };
              axios
                .post(
                  "https://online.mbbank.com.vn/api/retail_web/internetbanking/v2.0/doLogin",
                  requestData,
                  {
                    headers: {
                      Accept: "application/json, text/plain, */*",
                      "Accept-Language": "en-US,en;q=0.9",
                      Authorization:
                        "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
                      "Content-Type": "application/json; charset=UTF-8",
                      Cookie:
                        "MBAnalyticsaaaaaaaaaaaaaaaa_session_=HMDIOFLBOHEOEDGLMKGKEIJLGNPBNIJLONLNDELNOONIKCFEGCBADDCLEBPBFACBKMJDMJAKMELDEJCDFHBAADFHLHIIPFLFMMCPANMOLJGFLLJMFLEIPGEDIEFOEHLF; MBAnalyticsaaaaaaaaaaaaaaaa_session_=HIPGJIGFJPFAEOJOICIPDNKMGKFIIFNJMEPKEAMKOCAPKGNNPOJOJBAHIDFMANEIELKDIDICDPABBKHBDAAANGAEPGNPNOCNPEBEENODAOCKEANAHNKBOKIHONEOLJGL; _fbp=fb.2.1710940935356.1393287853; _ga_R3XMN343KH=GS1.1.1710940935.1.1.1710940976.19.0.0; _gid=GA1.3.2024419412.1712426582; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3457941770.7466.0000; BIGipServerk8s_online_banking_pool_9712=3457941770.61477.0000; _ga_T1003L03HZ=GS1.1.1712484171.12.1.1712486932.0.0.0; _ga=GA1.3.68244822.1710940936; JSESSIONID=AB0476A5E3ECA2FE9875CA99D16A82D3",
                      Origin: "https://online.mbbank.com.vn",
                      Referer: "https://online.mbbank.com.vn/pl/login?logout=1",
                      "Sec-Fetch-Dest": "empty",
                      "Sec-Fetch-Mode": "cors",
                      "Sec-Fetch-Site": "same-origin",
                      "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
                      "X-Request-Id": `d7965ec4454b82a0cf4bdf456e528cb1-${timestamp}`,
                      "elastic-apm-traceparent":
                        "00-6dd53eeae86a606a5f9c7f6c23b8cefd-115c8e047eae29c3-01",
                      "sec-ch-ua":
                        '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                      "sec-ch-ua-mobile": "?0",
                      "sec-ch-ua-platform": '"Windows"',
                    },
                  }
                )
                .then((response) => {
                  session = response.data.sessionId;
                  if (!session) {
                    AutoGetSession(timestamp);
                  }
                  console.log("sessionId:", session);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          })
          .catch((er) => {
            console.log(er);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getHistoryMBBank = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.cloudnest.vn/api/historymbbank?token=8fca57797ccc14061fe0d641017975d5"
    );
    if (response.data.status === "success") {
      const dataList = response.data.TranList;
      for (const data of dataList) {
        const match = data.description.match(/Nap(\d+)/i);
        const number = match ? match[1] : null;
        let user_id = number;
        if (/nap/i.test(data.description)) {
          const getRefno = "SELECT refNo FROM mbbank WHERE refNo = ?";
          const convertedDate = moment(
            data.transactionDate,
            "DD/MM/YYYY HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm:ss");

          db.query(getRefno, [data.refNo], (err, result) => {
            const query = `INSERT INTO mbbank (postingDate, transactionDate, accountNo, creditAmount, debitAmount, currency, description, availableBalance, beneficiaryAccount, refNo, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const values = [
              data.postingDate,
              convertedDate,
              data.accountNo,
              data.creditAmount,
              data.debitAmount,
              data.currency,
              data.description,
              data.availableBalance,
              data.beneficiaryAccount,
              data.refNo,
              0,
            ];
            if (err) {
              console.log(err);
            } else {
              const checkRefNoQuery = `SELECT COUNT(*) AS count FROM mbbank WHERE refNo = ?`;
              db.query(
                checkRefNoQuery,
                [data.refNo],
                (error, results, fields) => {
                  if (error) {
                    console.error("Error querying database:", error);
                    return;
                  }
                  const refNoExists = results[0].count > 0;
                  if (refNoExists) {
                    return;
                  } else {
                    db.query(query, values, (error, results, fields) => {
                      if (error) {
                        console.error("Error inserting into database:", error);
                        return;
                      }
                    });
                  }
                }
              );
            }
          });
          const checkStatusQuery = `SELECT status FROM mbbank WHERE refNo = ?`;
          const statusResult = await new Promise((resolve, reject) => {
            db.query(checkStatusQuery, [data.refNo], (err, results) => {
              if (err) {
                console.error("Lỗi khi kiểm tra trạng thái:", err);
                reject(err);
              } else {
                resolve(results);
              }
            });
          });
          if (statusResult.length > 0 && statusResult[0].status === 0) {
            await updateCreditAmount(data.refNo, user_id)
              .then(() => {
                console.log(
                  "Quá trình cập nhật hoàn tất cho refNo:",
                  data.refNo
                );
              })
              .catch((err) => {
                console.log(
                  "Lỗi trong quá trình cập nhật cho refNo:",
                  data.refNo,
                  err
                );
              });
          }
        }
      }
    }
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
};

const updateCreditAmount = (refNo, userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT creditAmount FROM mbbank WHERE refNo = ? AND status = 0`,
      [refNo],
      (err, creditAmountResults) => {
        if (err) {
          console.log("Lỗi lấy dữ liệu người dùng", err);
          reject(err);
          return;
        }
        if (creditAmountResults.length === 0) {
          console.log("Không có giao dịch nào để cập nhật");
          resolve();
          return;
        }
        const updates = creditAmountResults.map((creditAmountRow) => {
          return new Promise((resolve, reject) => {
            // console.log("userId", userId);
            db.query(
              `SELECT usd FROM users WHERE key_id LIKE ?`,
              [`%${userId}%`],
              (err, dataUsd) => {
                if (err) {
                  console.log(err);
                  reject(err);
                  return;
                }
                if (!dataUsd[0]) {
                  console.log("Không có dữ liệu usd cho người dùng này");
                  resolve();
                  return;
                }
                console.log(dataUsd);
                const newUsdValue =
                  dataUsd[0].usd + creditAmountRow.creditAmount;
                db.query(
                  "UPDATE users SET usd = ? WHERE key_id LIKE ?",
                  [newUsdValue, `%${parseInt(userId)}%`],
                  (err, dataSucc) => {
                    if (err) {
                      console.log(err);
                      reject(err);
                      return;
                    }
                    console.log("Cộng tiền thành công");
                    db.query(
                      `UPDATE mbbank SET status = 1 WHERE refNo = ?`,
                      [refNo],
                      (err, result) => {
                        if (err) {
                          console.log("Lỗi cập nhật mbbank", err);
                          reject(err);
                          return;
                        }
                        console.log("Cập nhật mbbank thành công");
                        resolve(result);
                      }
                    );
                  }
                );
              }
            );
          });
        });

        Promise.all(updates)
          .then(() => {
            console.log("Tất cả các cập nhật đã hoàn thành");
            resolve();
          })
          .catch((err) => {
            console.log("Có lỗi xảy ra trong quá trình cập nhật", err);
            reject(err);
          });
      }
    );
  });
};

exports.getOrderVPSCloud = (req, res) => {
  const { key_id } = req.body;
  const query = `SELECT * FROM history_order WHERE key_id = ${key_id} ORDER BY date_create DESC`;
  db.query(query, (err, rows) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      rows.forEach((row) => {
        const date = new Date(row.date_create);
        const date1 = new Date(row.next_due_date);
        const utcPlus7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        const utcPlus7Date1 = new Date(date1.getTime() + 7 * 60 * 60 * 1000);
        row.date_create = utcPlus7Date.toISOString();
        row.next_due_date = utcPlus7Date1.toISOString();
      });
      return res.status(200).send(rows);
    }
  });
};

exports.getHistoryATM = async (req, res) => {
  const key_id = req.body.id;
  console.log(key_id);
  const query = `SELECT * FROM mbbank WHERE description LIKE '%${key_id}%' ORDER BY transactionDate DESC
  `;
  db.query(query, (err, success) => {
    if (err) {
      console.log("lỗi lấy dữ liêu mb");
    } else {
      res.send(success);
    }
  });
};
