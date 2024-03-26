import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import { FormControl, MenuItem, Select } from "@mui/material";
import "./thesieure.scss";
import { useDispatch, useSelector } from "react-redux";
import { Topup, getHistoryTopup } from "../../../redux/request/api";
import Swal from "sweetalert2";

function Thesieure() {
  const dispatch = useDispatch();
  const [isToup, setIsTopUp] = useState(false);
  const [historyTopup, setHistoryTopUp] = useState([]);
  const data = useSelector((state) => state.topupCard);
  const user = localStorage.getItem("userData");
  const [infoCard, setInfoCard] = useState({
    telco: " ",
    amount: " ",
    code: "",
    serial: "",
    key_id: "",
  });
  useEffect(() => {
    const userData = JSON.parse(user);
    if (user) {
      setInfoCard((prevInfoCard) => ({
        ...prevInfoCard,
        key_id: userData.user.key,
      }));
      getHistoryTopup(userData.user.key)
        .then((data) => {
          if (data) {
            setHistoryTopUp(data);
          } else {
            console.log("Không có dữ liệu từ API");
          }
        })
        .catch((error) => {
          console.log("Lỗi khi gọi API: ", error);
        });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInfoCard({ ...infoCard, [name]: value });
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Vui lòng đăng nhập để tiếp tục",
        icon: "error",
      });
    } else {
      Topup(dispatch, infoCard);
      setIsTopUp(true);
    }
  };
  useEffect(() => {
    if (isToup) {
      const timer = setTimeout(() => {
        if (data.isSuccess) {
          if (data.data.status === 99) {
            Swal.fire({
              title: data.data.message,
              icon: "success",
            });
          } else {
            Swal.fire({
              title: data.data.message,
              icon: "error",
            });
          }
        } else {
          Swal.fire({
            title: data.error,
            icon: "error",
          });
        }
        setIsTopUp(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  });

  const renderMenuItem = (value, label) => (
    <MenuItem key={value} value={value} style={menuItemStyle}>
      {label}
    </MenuItem>
  );

  const renderSelect = (value, name, options, lable) => (
    <div className="form-column">
      <label htmlFor={name}>{lable}</label>
      <FormControl fullWidth size="small">
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          onChange={(e) => setInfoCard({ ...infoCard, [name]: e.target.value })}
          style={selectStyle}
        >
          {options.map((option) => renderMenuItem(option.value, option.label))}
        </Select>
      </FormControl>
    </div>
  );

  return (
    <React.Fragment>
      <Header />
      <div className="profile-wrap">
        <div className="card">
          <div className="card-wrap">
            <header>Nạp tiền bằng thẻ cào</header>

            <form action="" className="form-wrap">
              <div className="form-row">
                {renderSelect(
                  infoCard.telco,
                  "telco",
                  [
                    { value: " ", label: "chọn loại thẻ" },
                    { value: "VIETTEL", label: "Viettel" },
                    { value: "VINAPHONE", label: "mobifone" },
                    { value: "MOBIFONE", label: "vinafone" },
                    { value: "VNMOBI", label: "Vietnammobi" },
                    { value: "ZING", label: "Zing card" },
                  ],
                  "Loại thẻ"
                )}
              </div>
              <div className="form-row">
                {renderSelect(
                  infoCard.amount,
                  "amount",
                  [
                    { value: " ", label: "chọn mệnh giá" },
                    { value: "10000", label: "10.000đ" },
                    { value: "20000", label: "20.000đ" },
                    { value: "30000", label: "30.000đ" },
                    { value: "40000", label: "40.000đ" },
                    { value: "50000", label: "50.000đ" },
                    { value: "100000", label: "100.000đ" },
                    { value: "200000", label: "200.000đ" },
                    { value: "500000", label: "500.000đ" },
                    { value: "1000000", label: "1.00.0000đ" },
                  ],
                  "mệnh Giá"
                )}
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="code">Mã thẻ</label>
                  <TextField
                    id="code"
                    name="code"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Mã Thẻ"
                    onChange={handleChange}
                    InputProps={{
                      style: {
                        fontFamily: "Chakra Petch, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                      },
                      placeholder: "Mã Thẻ",
                      classes: { root: "placeholder" },
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="serial">Serial</label>
                  <TextField
                    id="serial"
                    name="serial"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Số Serial"
                    onChange={handleChange}
                    InputProps={{
                      style: {
                        fontFamily: "Chakra Petch, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                      },
                      placeholder: "Mã Thẻ",
                      classes: { root: "placeholder" },
                    }}
                  />
                </div>
              </div>
              <div className="form-row" onClick={handleTopup}>
                <div className="form-column">
                  <div className="change-form">Nạp thẻ</div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="card">
          <div className="card-wrap">
            <header>Lưu ý</header>
            <div className="ab">
              <p>
                1. Nạp tiền thông qua API của THESIEURE sẽ được duyệt tự động,
                Nhưng sẽ bị trừ chiết khấu của nhà mạng.
              </p>
              <p>
                2. chọn sai mệnh giá sẽ bị trừ 50% giá trị đây là bên THESIEURE
              </p>
              <p>
                3. nạp thẻ quá lâu mà chưa thấy cộng, vui lòng liên hệ admin.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="banggia">
        <span>Bảng phí đổi thẻ cào</span>
        <table>
          <thead>
            <tr>
              <th>Nhóm</th>
              <th>10,000đ</th>
              <th>20,000đ</th>
              <th>30,000đ</th>
              <th>50,000đ</th>
              <th>100,000đ</th>
              <th>200,000đ</th>
              <th>500,000đ</th>
              <th>1,000,000đ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VIETTEL</td>
              <td>16.5%</td>
              <td>12.5%</td>
              <td>16.5%</td>
              <td>12%</td>
              <td>12%</td>
              <td>15%</td>
              <td>16%</td>
              <td>19.5%</td>
            </tr>
            <tr>
              <td>MOBIFONE</td>
              <td>19%</td>
              <td>19%</td>
              <td>19%</td>
              <td>17.5%</td>
              <td>16.5%</td>
              <td>16%</td>
              <td>16%</td>
              <td>15.5%</td>
            </tr>
            <tr>
              <td>VINAFONE</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
              <td>22%</td>
            </tr>
            <tr>
              <td>ZING</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
              <td>11.5%</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "24px" }}>
          <label htmlFor="">Lịch sử giao dịch</label>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>số Serial</th>
                <th>Mã thẻ</th>
                <th>mệnh giá</th>
                <th>Nhận được</th>
                <th>Thời gian</th>
                <th>trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {historyTopup.length <= 0 ? (
                <tr>
                  <td colSpan="7">
                    <div style={{ marginTop: "1rem" }}>
                      <svg
                        width="64"
                        height="41"
                        viewBox="0 0 64 41"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          transform="translate(0 1)"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <ellipse
                            fill="#f5f5f5"
                            cx="32"
                            cy="33"
                            rx="32"
                            ry="7"
                          ></ellipse>
                          <g fillRule="nonzero" stroke="#d9d9d9">
                            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                            <path
                              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                              fill="#fafafa"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p>Không có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                historyTopup.map((data, index) => {
                  let status;
                  let amount;
                  let color;
                  let formattedTime;
                  let font;
                  if (data.time) {
                    try {
                      const timeString = new Date(data.time).toISOString();
                      formattedTime = `${timeString.slice(
                        0,
                        10
                      )} ${timeString.slice(11, 19)}`;
                    } catch (error) {}
                  }
                  if (parseInt(data.status) === 3) {
                    status = "thất bại";
                    color = "#dc3545";
                  } else if (parseInt(data.status) === 99) {
                    status = "đang chờ";
                    color = "#ffff26ed";
                    font = "#4a4a4a";
                  } else {
                    status = "Thành công";
                    color = "#28a745";
                  }
                  if (data.amount === null) {
                    amount = "Không xác định";
                  }
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.serial}</td>
                      <td>{data.code}</td>
                      <td>{data.declared_value}</td>
                      <td>{data.amount ? data.amount : amount}</td>
                      <td>{formattedTime}</td>
                      <td>
                        <span
                          style={{
                            backgroundColor: color,
                            padding: 4,
                            borderRadius: 4,
                            fontSize: 12,
                            color: font ? font : "white",
                          }}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Thesieure;

const selectStyle = {
  fontFamily: "Chakra Petch, sans-serif",
  fontSize: "14px",
  fontWeight: 600,
};

const menuItemStyle = {
  fontFamily: "Chakra Petch, sans-serif",
  fontSize: "14px",
  fontWeight: 600,
};
