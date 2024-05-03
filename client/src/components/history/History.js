import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  ExtendVPS,
  HistoryAll,
  ResetVPS,
  getHistoryOrderVPS,
} from "../../redux/request/api";
import "./history.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 8,
  borderRadius: 2,
  p: 2,
};
function History() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [history, setHistory] = useState([]);
  const [historyVPS, setHistoryVPS] = useState([]);
  const [id, setId] = useState("");
  const [keyID, setKeyID] = useState("");
  const dispatch = useDispatch();
  const data = useSelector((state) => state.history);
  const user = localStorage.getItem("info");
  console.log(id);
  console.log(keyID);
  useEffect(() => {
    if (user) {
      const userData = JSON.parse(user);
      setId(userData.key_id);
      setKeyID(userData.key_id);
      getHistoryOrderVPS(userData.key_id, localStorage.getItem("token"))
        .then((data) => {
          setHistoryVPS(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    HistoryAll(dispatch, id, localStorage.getItem("token"));
  }, [dispatch, id, user]);
  useEffect(() => {
    setHistory(data.history);
  }, [data.history]);
  const combinedArray = history.concat(historyVPS);

  const [dataToShow, setDataToShow] = useState(null);
  const [action, setAction] = useState(false);
  const [message, setMessage] = useState("");
  const resetVPS = async () => {
    await ResetVPS(dataToShow.vps_id)
      .then((data) => {
        setMessage(data);
      })
      .catch((err) => {});
    setAction(true);
    setOpen(false);
  };

  const extendVPS = async () => {
    await ExtendVPS(dataToShow.vps_id, keyID)
      .then((data) => {
        setMessage(data);
      })
      .catch((err) => {
        console.log(err);
      });
    setAction(true);
    setOpen(false);
  };
  useEffect(() => {
    if (action) {
      if (message.message) {
        Swal.fire({
          text: message.message,
          icon: "success",
        });
        setAction(false);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
        });
        setAction(false);
      }
    }
  }, [action, message]);
  console.log(combinedArray);
  return (
    <React.Fragment>
      <Header />
      <div className="discount">
        <p style={{ fontSize: "20px", fontWeight: "600" }}>lịch sử giao dịch</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã code</th>
              <th>thể loại</th>
              <th>Tổng tiền</th>
              <th>mã giảm giá</th>
              <th>thao tác</th>
              <th>thời gian</th>
            </tr>
          </thead>
          <tbody>
            {combinedArray.length === 0 ? (
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
              combinedArray.map((data, index) => {
                let ads;
                let formattedTime = "không xác định";

                if (data.category === "tools") {
                  try {
                    const timeString = new Date(data.time).toISOString();
                    formattedTime = `${timeString.slice(
                      0,
                      10
                    )} ${timeString.slice(11, 19)}`;
                  } catch (error) {}
                } else {
                  try {
                    formattedTime = data.date_create.slice(0, 10);
                  } catch (error) {}
                  ads = true;
                }
                const priceFormatted = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(data.total);

                return (
                  <tr
                    key={index}
                    className="td-hover"
                    style={{ position: "relative" }}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <span
                        style={{
                          borderRadius: "4px",
                          padding: "4px",
                          backgroundColor: "#ffff6e",
                        }}
                      >
                        {data.code ? data.code : data.vps_id}
                      </span>
                    </td>
                    <td>{data.category ? data.category : "Vps"}</td>
                    <td>{priceFormatted}</td>
                    <td>{data.discount === 1 ? "có" : "Không"}</td>
                    {ads ? (
                      <td>
                        <div
                          onClick={() => {
                            handleOpen();
                            setDataToShow(data);
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontFamily: "Chakra Petch, sans-serif",
                              fontWeight: 600,
                              color: "white",
                              backgroundColor: "#28a745",
                              padding: 4,
                              borderRadius: 4,
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} /> Show
                          </span>
                        </div>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="simple-modal-title"
                          aria-describedby="simple-modal-description"
                          sx={{
                            "& .MuiBackdrop-root": {
                              backgroundColor: "rgb(0 0 0 / 14%)", // Áp dụng màu và độ mờ cho backdrop
                            },
                          }}
                        >
                          <Box sx={style}>
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              <span
                                style={{
                                  fontSize: 18,
                                  fontFamily: "Chakra Petch, sans-serif",
                                  fontWeight: 600,
                                }}
                              >
                                Thông tin vps của bạn
                              </span>
                            </Typography>
                            <Typography
                              id="modal-modal-description"
                              sx={{
                                mt: 2,
                                fontFamily: "Chakra Petch, sans-serif",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                            >
                              {dataToShow ? (
                                <>
                                  <span>IP: {dataToShow.ip}</span>
                                  <br />
                                  <span>Tài khoản: {dataToShow.username}</span>
                                  <br />
                                  <span>Mật khẩu: {dataToShow.password}</span>
                                  <br />
                                  <span>
                                    ngày hết hạn:{" "}
                                    {`${dataToShow.next_due_date.slice(
                                      0,
                                      10
                                    )}, vào lúc:  ${dataToShow.next_due_date.slice(
                                      11,
                                      19
                                    )}`}
                                  </span>
                                  <br />
                                  <span>
                                    Trạng thái:{" "}
                                    <span
                                      style={{
                                        backgroundColor: "#28a728",
                                        color: "white",
                                        padding: 2,
                                        borderRadius: 4,
                                      }}
                                    >
                                      Active
                                    </span>
                                  </span>
                                  <br />
                                  <li style={{ marginTop: 12 }}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      style={{
                                        marginRight: 12,
                                        fontFamily: "Chakra Petch, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                      }}
                                      onClick={resetVPS}
                                    >
                                      restart
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      style={{
                                        fontFamily: "Chakra Petch, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                      }}
                                      onClick={extendVPS}
                                    >
                                      Gia hạn
                                    </Button>
                                  </li>
                                  <li
                                    style={{
                                      marginTop: 12,
                                      color: "#00af0fc7",
                                    }}
                                  >
                                    Gia hạn mặc định là 1 tháng với giá tiền là
                                    85.000đ
                                  </li>
                                </>
                              ) : (
                                " "
                              )}
                            </Typography>
                          </Box>
                        </Modal>
                      </td>
                    ) : (
                      <td>
                        <span className="action">
                          <FontAwesomeIcon icon={faDownload} /> Tải xuống
                        </span>
                      </td>
                    )}

                    <td>{formattedTime}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* {showHello && (
          <div className="show-vps">
            <div className="content-lable1">
              <div className="content-lable">
                <span>Thông tin VPS của bạn</span>
                <span
                  className="close"
                  style={{ cursor: "pointer" }}
                  onClick={handleCloseToast}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </div>

              <div className="info-show">
                <span>IP: {dataToShow.ip}</span>
                <br />
                <span>Tài khoản: {dataToShow.username}</span>
                <br />
                <span>Mật khẩu: {dataToShow.password}</span>
                <br />
                <span>
                  ngày hết hạn:{" "}
                  {`${dataToShow.next_due_date.slice(
                    0,
                    10
                  )}, vào lúc:  ${dataToShow.next_due_date.slice(11, 19)}`}
                </span>
                <br />
                <span>
                  trạng thái:{" "}
                  <span
                    style={{
                      backgroundColor: "#28a728",
                      color: "white",
                      padding: 2,
                      borderRadius: 4,
                    }}
                  >
                    {dataToShow.vps_status}
                  </span>
                </span>
                <br />
              </div>
            </div>
          </div>
        )} */}
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default History;
