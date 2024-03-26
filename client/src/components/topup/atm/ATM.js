import React, { useEffect, useState } from "react";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import "./atm.scss";
function ATM() {
  const [id, setId] = useState("");
  useEffect(() => {
    const user = localStorage.getItem("userData");
    const userData = JSON.parse(user);
    if (user) {
      setId(userData.user.key);
    }
  }, []);
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
              3. Trường hợp nạp tiền quá lâu mà chưa thấy cộng, vui lòng liên hệ
              admin.
            </p>
          </div>
        </div>
        <div className="topup-img">
          <div className="img-atm">
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
          </div>
          <div className="img-atm">
            <div className="stk-atm">
              <span>ATM:</span>
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
              <p>Nhập đúng nội dung sẽ được cộng tiền tự động.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default ATM;
