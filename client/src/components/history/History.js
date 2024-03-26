import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { HistoryAll } from "../../redux/request/api";
import "./history.scss";

function History() {
  const [history, setHistory] = useState([]);
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const data = useSelector((state) => state.history);
  const user = localStorage.getItem("userData");
  useEffect(() => {
    if (user) {
      const userData = JSON.parse(user);
      setId(userData.user.id);
    }
    HistoryAll(dispatch, id);
  }, [dispatch, id, user]);

  useEffect(() => {
    setHistory(data.history);
  }, [data.history]);

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
            {history.length === 0 ? (
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
              history.map((history, index) => {
                let formattedTime = "không xác định";
                if (history.time) {
                  try {
                    const timeString = new Date(history.time).toISOString();
                    formattedTime = `${timeString.slice(
                      0,
                      10
                    )} ${timeString.slice(11, 19)}`;
                  } catch (error) {}
                }
                const priceFormatted = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(history.total);

                return (
                  <tr key={index} className="td-hover">
                    <td>{index + 1}</td>
                    <td>
                      <span
                        style={{
                          borderRadius: "4px",
                          padding: "4px",
                          backgroundColor: "red",
                        }}
                      >
                        {history.code}
                      </span>
                    </td>
                    <td>{history.category}</td>
                    <td>{priceFormatted}</td>
                    <td>{history.discount === 1 ? "có" : "Không"}</td>
                    <td>tải xuống</td>
                    <td>{formattedTime}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default History;
