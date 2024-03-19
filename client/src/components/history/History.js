import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { HistoryAll } from "../../redux/request/api";
import "./history.scss";

function History() {
  const [history, setHistory] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.history);
  const user = localStorage.getItem("userData");
  const userData = JSON.parse(user);

  const id = userData.user.id;

  useEffect(() => {
    HistoryAll(dispatch, id);
  }, [dispatch, id]);

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
            {history.map((history, index) => {
              let formattedTime = "không xác định";
              if (history.time) {
                try {
                  const timeString = new Date(history.time).toISOString();
                  formattedTime = `${timeString.slice(
                    0,
                    10
                  )} ${timeString.slice(11, 19)}`;
                } catch (error) {
                  console.error("Error parsing time:", error);
                }
              }
              const priceFormatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(history.total);

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{history.code}</td>
                  <td>{history.category}</td>
                  <td>{priceFormatted}</td>
                  <td>{history.discount === 1 ? "có" : "Không"}</td>
                  <td>tải xuống</td>
                  <td>{formattedTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default History;
