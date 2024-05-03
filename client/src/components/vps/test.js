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
              key: user.key_id,
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
        "SELECT * FROM users WHERE key_id = ?",
        [key_id],
        (err, keyRows) => {
          if (err) {
            return res.status(500).send("Internal Server Error");
          }
          while (keyRows.length > 0) {
            const key_id =
              Math.floor(Math.random() * (99999999 - 11111111 + 1)) + 111111;
            keyRows = db.query("SELECT * FROM users WHERE key_id = ?", [
              key_id,
            ]);
          }
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              db.query(
                "INSERT INTO users (name, username, password, key_id) VALUES (?, ?, ?, ?)",
                [email, username, hash, key_id],
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
  const id = req.params.id;
  db.query("SELECT usd FROM users WHERE id = ?", [id], (err, rows) => {
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

  const getUserQuery = `SELECT * FROM users WHERE id = ${userId}`;
  const getProductQuery = `SELECT * FROM ${category} WHERE id = ${productId}`;
  const getDiscount = `SELECT * FROM discount WHERE name = "${discount_client}"`;

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
      if (discount_client) {
        db.query(getDiscount, (err, discountResult) => {
          if (err) {
            res.status(500).json({
              error: "Internal server error 1",
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
      console.log("vcls");
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
                console.log(response1.data);
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
  const key_id = req.body;
  if (!key_id) {
    return;
  }
  const queryTopup = `SELECT * FROM topup WHERE user_id=${22222}`;
  db.query(queryTopup, (err, rows) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    }
    if (rows.length > 0) {
      return res.status(200).send(rows);
    } else {
      return res.status(404).send("No topup found");
    }
  });
};

exports.History = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return;
  }
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

/// vps
// exports.VPSConnect = async (req, res) => {
// const api_username = "doanhhoang2903@gmail.com";
// const api_app = "ZPJAM1sc5FHMSjYBAtH2AYVv";
// const api_secret =
// "5Fjamcz6Mmejs6Ek3WxK9RKpkeeZYyCsJzVfWCNKCIXodTHAFepdCKuslZMB9tyJUXiTY2q2OhnQ7fk93eVZuPPcHlyWeVgBll7xLx4IvVlPQxqEIYgZ7Yo4pS0pYCp1";
// try {
// const response = await axios.post(
// "https://client.cloudnest.vn/api/agency/get-token",
// {
// "api-username": api_username,
// "api-app": api_app,
// "api-secret": api_secret,
// },
// {
// headers: {
// "Content-Type": "application/json",
// },
// }
// );
// const token = response.data["auth-token"];
// try {
// const product = await axios.get(
// "https://client.cloudnest.vn/api/agency/get-product",
// {
// headers: {
// "Content-Type": "application/json",
// "api-username": api_username,
// "api-app": api_app,
// "api-secret": api_secret,
// "auth-token": token,
// },
// }
// );
// const vps = product.data["products"].vps[0].product;
// console.log(vps)
// } catch (error) {}
// try {
// const os = await axios.get(
// "https://client.cloudnest.vn/api/agency/get-list-os",
// {
// headers: {
// "Content-Type": "application/json",
// "api-username": api_username,
// "api-app": api_app,
// "api-secret": api_secret,
// "auth-token": token,
// },
// }
// );
// // console.log(os.data["os-vps"]);
// } catch (err) {}
// try {
// const billing = await axios.get(
// "https://client.cloudnest.vn/api/agency/get-list-billing-cycle",
// {
// headers: {
// "Content-Type": "application/json",
// "api-username": api_username,
// "api-app": api_app,
// "api-secret": api_secret,
// "auth-token": token,
// },
// }
// );
// // console.log(billing.data["billing-cycle"]);
// } catch (error) {
// console.log(error)
// }
// // try {
// // const order_vps = await axios.post(
// // "https://client.cloudnest.vn/api/agency/order/create-order",
// // {
// // "product-id": 55,
// // "billing-cycle": "twomonthly",
// // "os": 1,
// // "quantity": 1,
// // "addon-cpu": 1,
// // "addon-ram": 1,
// // "addon-disk": 30
// // },
// // {
// // headers: {
// // "Content-Type": "application/json",
// // "api-username": api_username,
// // "api-app": api_app,
// // "api-secret": api_secret,
// // "auth-token": token
// // },
// // }
// // );

// // console.log(order_vps.data);
// // } catch (error) {
// // console.error(error);
// // }
// } catch (error) {
// console.error(error);
// }
// };

// {
//   "api-username": "doanhhoang2903@gmail.com",
//   "api-app": "ZPJAM1sc5FHMSjYBAtH2AYVv",
//   "api-secret": "5Fjamcz6Mmejs6Ek3WxK9RKpkeeZYyCsJzVfWCNKCIXodTHAFepdCKuslZMB9tyJUXiTY2q2OhnQ7fk93eVZuPPcHlyWeVgBll7xLx4IvVlPQxqEIYgZ7Yo4pS0pYCp1"
// }

const api_username = "doanhhoang2903@gmail.com";
const api_app = "ZPJAM1sc5FHMSjYBAtH2AYVv";
const api_secret =
  "5Fjamcz6Mmejs6Ek3WxK9RKpkeeZYyCsJzVfWCNKCIXodTHAFepdCKuslZMB9tyJUXiTY2q2OhnQ7fk93eVZuPPcHlyWeVgBll7xLx4IvVlPQxqEIYgZ7Yo4pS0pYCp1";

// Hàm để lấy token
const getToken = async () => {
  try {
    const response = await axios.post(
      "https://client.cloudnest.vn/api/agency/get-token",
      {
        "api-username": api_username,
        "api-app": api_app,
        "api-secret": api_secret,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data["auth-token"];
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

// Endpoint để lấy danh sách hệ điều hành của VPS
exports.os = async (req, res) => {
  try {
    const token = await getToken();
    const os = await axios.get(
      "https://client.cloudnest.vn/api/agency/get-list-os",
      {
        headers: {
          "Content-Type": "application/json",
          "api-username": api_username,
          "api-app": api_app,
          "api-secret": api_secret,
          "auth-token": token,
        },
      }
    );
    res.send(os.data["os-vps"]);
  } catch (error) {
    console.error("Error fetching OS list:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Endpoint để lấy thông tin sản phẩm VPS
exports.product_vps = async (req, res) => {
  try {
    const token = await getToken();
    const product = await axios.get(
      "https://client.cloudnest.vn/api/agency/get-product",
      {
        headers: {
          "Content-Type": "application/json",
          "api-username": api_username,
          "api-app": api_app,
          "api-secret": api_secret,
          "auth-token": token,
        },
      }
    );
    try {
      const token = await getToken();
      const product = await axios.get(
        "https://client.cloudnest.vn/api/agency/get-product",
        {
          headers: {
            "Content-Type": "application/json",
            "api-username": api_username,
            "api-app": api_app,
            "api-secret": api_secret,
            "auth-token": token,
          },
        }
      );

      if (product.data && product.data.products && product.data.products.vps) {
        const vpsProducts = product.data.products.vps;

        vpsProducts.forEach((group) => {
          if (group.product) {
            Object.values(group.product).forEach((vps) => {
              switch (vps.product_id) {
                case 46:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 29000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 58000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 72000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 124000);
                  updatePricing(vps.pricing.annually, "1 Năm", 228000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 456000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 684000);
                  break;
                case 47:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 43000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 86000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 109000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 188000);
                  updatePricing(vps.pricing.annually, "1 Năm", 1113600);
                  updatePricing(vps.pricing.biennially, "2 Năm", 622000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 928000);
                  break;
                case 48:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 57000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 114000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 151000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 252000);
                  updatePricing(vps.pricing.annually, "1 Năm", 504000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 1108000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 1512000);
                  break;
                case 49:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 85000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 170000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 220000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 470000);
                  updatePricing(vps.pricing.annually, "1 Năm", 760000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 1520000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 2280000);
                  break;
                case 50:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 135000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 270000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 350000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 610000);
                  updatePricing(vps.pricing.annually, "1 Năm", 1220000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 2440000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 3660000);
                  break;
                case 51:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 93000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 186000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 239000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 408000);
                  updatePricing(vps.pricing.annually, "1 Năm", 816000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 1632000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 2428000);
                  break;
                case 52:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 351000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 702000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 938000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 1641000);
                  updatePricing(vps.pricing.annually, "1 Năm", 3282000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 6564000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 9846000);
                  break;
                case 53:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 82000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 164000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 216000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 432000);
                  updatePricing(vps.pricing.annually, "1 Năm", 864000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 1728000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 2592000);
                  break;
                case 54:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 98000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 196000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 254000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 480000);
                  updatePricing(vps.pricing.annually, "1 Năm", 960000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 1900000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 2800000);
                  break;
                case 55:
                  updatePricing(vps.pricing.monthly, "1 Tháng", 160000);
                  updatePricing(vps.pricing.twomonthly, "2 Tháng", 310000);
                  updatePricing(vps.pricing.quarterly, "3 Tháng", 430000);
                  updatePricing(vps.pricing.semi_annually, "6 Tháng", 740000);
                  updatePricing(vps.pricing.annually, "1 Năm", 1400000);
                  updatePricing(vps.pricing.biennially, "2 Năm", 2800000);
                  updatePricing(vps.pricing.triennially, "3 Năm", 4200000);
                  break;
                default:
                  break;
              }
              // if (
              // vps.product_id === 46 &&
              // vps.pricing.monthly &&
              // vps.pricing.monthly.billing_cycle === "1 Tháng"
              // ) {
              // // Cập nhật giá trị pricing thành 85000
              // vps.pricing.monthly.amount = 85000;
              // }
            });
          }
        });

        res.send(product.data);
      } else {
        res.status(404).send("Data not found");
      }
    } catch (error) {
      console.error("Error fetching VPS product info:", error);
      res.status(500).send("Internal Server Error");
    }
    // res.send(product.data);
  } catch (error) {
    console.error("Error fetching VPS product info:", error);
    res.status(500).send("Internal Server Error");
  }
};
function updatePricing(pricing, billingCycle, amount) {
  if (pricing && pricing.billing_cycle === billingCycle) {
    pricing.amount += amount;
  }
}

exports.billing = async (req, res) => {
  try {
    const token = await getToken();
    const billing = await axios.get(
      "https://client.cloudnest.vn/api/agency/get-list-billing-cycle",
      {
        headers: {
          "Content-Type": "application/json",
          "api-username": api_username,
          "api-app": api_app,
          "api-secret": api_secret,
          "auth-token": token,
        },
      }
    );
    res.send(billing.data);
  } catch (error) {
    console.error("Error fetching VPS product info:", error);
    res.status(500).send("Internal Server Error");
  }
};

