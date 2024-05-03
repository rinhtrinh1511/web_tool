import React, { useEffect, useState } from "react";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import "./atm.scss";
import { getHMB, topupCard } from "../../../redux/request/api";
function ATM() {
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [isIdReady, setIsIdReady] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("info");
    const userData = JSON.parse(user);
    if (user) {
      setId(userData.key_id);
      setIsIdReady(true);
    }
  }, []);
  console.log(data);
  useEffect(() => {
    if (isIdReady) {
      const fetchData = async () => {
        await getHMB(id, localStorage.getItem("token")).then((data) => {
          setData(data);
        });
        await topupCard(localStorage.getItem("token"));
      };
      fetchData();
    }
  }, [id, isIdReady]);
  return (
    <React.Fragment>
      <Header />
      <div className="atm">
        <div className="atm-note">
          <div className="ab">
            <p>
              1. Nạp tiền bằng ATM, MOMO và THESIEURE sẽ được duyệt tự động. Bạn
              cần ghi đúng nội dung chuyển khoản cảm ơn.
            </p>
            <p>
              2. Sau khi nạp thẻ mà quên nội dung chuyển khoản. Vui lòng liên hệ
              admin để được hỗ trợ.
            </p>
            <p>
              3. thời gian để server lỏ xử lý là 1 đến 2 phút nạp tiền vào giờ
              hành chính để được cộng nhanh nhất.
            </p>
            <p>
              4. Trường hợp nạp tiền quá lâu mà chưa thấy cộng, vui lòng liên hệ
              admin.
            </p>
          </div>
        </div>
        <div className="topup-img">
          {/* <div className="img-atm">
            <div className="stk-atm">
              <span>MOMO:</span>
              <span>0969938892</span>
            </div>
            <div className="stk-atm">
              <span>Chủ TK:</span>
              <span>Trịnh Văn Rinh</span>
            </div>
            <div className="stk-atm">
              <span>Nội dung:</span>
              <span>NAP{id}</span>
            </div>
            <div className="stk-atm">
              <p>Do Momo đang quét gay gắt lên sẽ được nạp bằng cơm 💀</p>
            </div>
          </div> */}

          <div className="mbbank">
            <img
              loading="lazy"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_MB_new.png/1200px-Logo_MB_new.png"
              alt="mb"
            />
            <div className="img-atm">
              <div className="stk-atm">
                <span>MBbank:</span>
                <span>0969938892</span>
              </div>
              <div className="stk-atm">
                <span>Chủ TK:</span>
                <span>Trinh Van Rinh</span>
              </div>
              <div className="stk-atm">
                <span>Nội dung:</span>
                <span>{id ? `Nap${id}` : "Đăng nhập đi."}</span>
              </div>
              <div className="stk-atm">
                <p>Nhập nội dung đúng sẽ được cộng tiền tự động.</p>
              </div>
            </div>
          </div>
          <img
            src={`https://img.vietqr.io/image/MB-0969938892-compact.png`}
            alt="a"
            style={{ width: 320, margin: "36px 32px 0 0" }}
          />
        </div>
        <div className="h-mb">
          <p style={{ fontSize: "20px", fontWeight: "600" }}>
            lịch sử giao dịch
          </p>
          <table>
            <thead>
              <tr>
                <th>STK</th>
                <th>TK nhận</th>
                <th>số tiền</th>
                <th>mã giao dịch</th>
                <th>thời gian</th>
                <th>trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.length <= 0 ? (
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
                data?.map((data, index) => {
                  let status;
                  let color;
                  if (parseInt(data.status) === 0) {
                    status = "chờ một chút";
                    color = "rgb(194 220 53)";
                  } else if (parseInt(data.status) === 1) {
                    status = "Thành công";
                    color = "rgb(90 255 38 / 93%)";
                  }
                  const match = data.description.match(/\b\d+\b/);

                  // Nếu tìm thấy, lấy chuỗi số đầu tiên
                  const number = match ? match[0] : null;
                  return (
                    <tr key={data.id}>
                      <td>{index + 1}</td>
                      <td>{data.accountNo}</td>
                      <td>{data.creditAmount}</td>
                      <td>{number}</td>
                      <td>{formatdate(data.transactionDate)}</td>
                      <td>
                        <span
                          style={{
                            backgroundColor: color,
                            padding: 4,
                            borderRadius: 4,
                            fontSize: 12,
                            color: "#259d00",
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
const formatdate = (originalDate) => {
  let dateObject = new Date(originalDate);
  let utcOffsetInMilliseconds = dateObject.getTimezoneOffset() * 60000;
  dateObject.setTime(
    dateObject.getTime() + utcOffsetInMilliseconds + 7 * 3600000
  );
  let year = dateObject.getFullYear();
  let month = String(dateObject.getMonth() + 1).padStart(2, "0");
  let day = String(dateObject.getDate()).padStart(2, "0");
  let hours = String(dateObject.getHours()).padStart(2, "0");
  let minutes = String(dateObject.getMinutes()).padStart(2, "0");
  let seconds = String(dateObject.getSeconds()).padStart(2, "0");

  let convertedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return convertedDate;
};
export default ATM;
