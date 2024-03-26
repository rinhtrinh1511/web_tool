import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faBell,
  faCoins,
  faCreditCard,
  faCube,
  faHome,
  faLandmark,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarespace } from "@fortawesome/free-brands-svg-icons";
import "./header.scss";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import { resetHistory } from "../../redux/slice/history";
import { getUsd } from "../../redux/request/api";

function Header() {
  const [data, setData] = useState({});
  const [usd, setUsd] = useState(0);
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleNavClick = () => {
    setIsNavOpen(!isNavOpen);
  };
  const logout1 = () => {
    logout(dispatch);
    dispatch(resetHistory());
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("usd");
    navigate("/login");
  };
  useEffect(() => {
    const user = localStorage.getItem("userData");
    const userData = JSON.parse(user);
    const fetchData = async () => {
      await getUsd(userData.user.id).then((data) => {
        setUsd(data);
      });
    };
    if (user) {
      fetchData();
      setData(userData.user);
    }
  }, []);
  const priceFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(usd);

  const renderAuthSection = () => {
    if (localStorage.getItem("userData")) {
      return (
        <div className="header-login ax1">
          <div className="login rainbow" onClick={handleNavClick}>
            💀 Xin chào: {data.name}
            <br />
            SD: {priceFormatted}
          </div>
          {isNavOpen && (
            <div className="nav-container">
              <ul>
                <li>
                  <Link to={"/profile"}>thông tin</Link>
                </li>

                <li onClick={logout1}>Đăng xuất</li>
              </ul>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="header-login">
          <Link to={"/login"}>
            <div className="login ">
              <FontAwesomeIcon icon={faUser} className="icons" />
              Đăng nhập
            </div>
          </Link>
          <div className="resgiter rainbow">
            <Link to={"/register"}>Đăng ký</Link>
          </div>
        </div>
      );
    }
  };
  /////
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      const hasVisitedBefore = sessionStorage.getItem("hasVisitedBefore");
      if (!hasVisitedBefore) {
        setShowToast(true);
        sessionStorage.setItem("hasVisitedBefore", true);
      }

      const handleUnload = () => {
        sessionStorage.removeItem("hasVisitedBefore");
      };

      window.addEventListener("unload", handleUnload);

      return () => {
        window.removeEventListener("unload", handleUnload);
      };
    }
  }, [location.pathname]);

  const handleCloseToast = () => {
    setShowToast(false);
  };
  return (
    <React.Fragment>
      {showToast && (
        <div className="toast">
          <div className="form-toast">
            <div className="header-toast">
              <label htmlFor="">
                <FontAwesomeIcon icon={faBell} style={{ marginRight: 4 }} />
                Thông báo
              </label>
              <div>
                <span
                  className="close"
                  style={{ cursor: "pointer" }}
                  onClick={handleCloseToast}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </div>
            </div>
            <div className="content-toast">
              <span>
                Mọi thắc mắc vui lòng liên hệ để được giải đáp hoặc{" "}
                <span style={{ color: "red", fontWeight: 600 }}>ĐÉO</span>
                <br />
                <a href="https://www.facebook.com/ring.dev123/">Facebook</a>
                {" hoặc "}
                zalo 0969938892
              </span>
              <br />
              <span>
                Trong quá trình sử dụng dịch vụ có lỗi vui lòng liên hệ
                <br />
                <a href="https://www.facebook.com/DoanhHoang.0332692526">
                  Hoàng Doanh
                </a>
                {" hoặc "}
                zalo 0969938892
              </span>
              <br />
              <span>
                Website cung cấp VPS tự động&nbsp;
                <span style={{ color: "green" }}>username: Administrator</span>
                &nbsp;
                <span style={{ color: "green" }}>password: Rinhdz1@@#</span> IP
                sẽ được gửi đến lịch sử sau khi đã đặt hàng.
              </span>
              <br />
              <span>Proxy sẽ được update trong thời gian tới.</span>
              <br />
              {/* <span className="blink">Ở đây không phải thiên đình.</span>
              <br />
              <span className="blink">
                Nên đừng ảo tưởng mình là thượng đế.
              </span> */}
              <span>Cảm ơn.</span>
              <div className="marquee-container">
                <span className="marquee">╭∩╮( •̀_•́ )╭∩╮</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="header-wrap">
        <div className="logo">
          <Link to={"/"}>
            <img
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/87130cc4-b297-4d4c-8fbf-5a26937514c3/daxn5se-22da1e01-7201-4535-a123-44d391e6bac1.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg3MTMwY2M0LWIyOTctNGQ0Yy04ZmJmLTVhMjY5Mzc1MTRjM1wvZGF4bjVzZS0yMmRhMWUwMS03MjAxLTQ1MzUtYTEyMy00NGQzOTFlNmJhYzEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.px7MSPTjBkT-z7N8UZFJOuV41xYDcDy6d5PdtekTxQg"
              alt="logo"
            />
          </Link>
        </div>
        <ul className="header-mid">
          <NavItem icon={faHome} text="Trang chủ" to="/" />
          <NavItem icon={faCoins} text="Xem giảm giá" to="/discount" />
          <NavItemWithDropdown
            icon={faCreditCard}
            text="Nạp tiền"
            items={[
              { icon: faLandmark, text: "Ngân hàng", to: "/atm" },
              { icon: faCreditCard, text: "Nạp thẻ", to: "/card" },
            ]}
          />
          <NavItemWithDropdown
            icon={faCube}
            text="Lịch sử"
            items={[
              { text: "1. Biến động số dư", to: "/" },
              { text: "2. lịch sử giao dịch", to: "/history" },
            ]}
          />
          <NavItemWithDropdown
            icon={faSquarespace}
            text="Danh mục khác"
            items={[
              { text: "Proxy" },
              { text: "kích hoạt key", to: "/active" },
              { text: "Gia hạn vps" },
              { text: "Tool phá làng, phá xóm" },
            ]}
            to="/atm"
          />
        </ul>
        {renderAuthSection()}
      </div>
    </React.Fragment>
  );
}

function NavItem({ icon, text, to }) {
  return (
    <li className="hover-3">
      <Link to={to}>
        <FontAwesomeIcon icon={icon} style={{ marginRight: "4px" }} />
        {text}
      </Link>
    </li>
  );
}

function NavItemWithDropdown({ icon, text, items, to }) {
  return (
    <li className="hover-3">
      <FontAwesomeIcon icon={icon} style={{ marginRight: "4px" }} />
      {text}
      <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: "8px" }} />
      <ul className="sub-menu">
        {items.map((item, index) => (
          <Link to={item.to} key={index}>
            <li>
              {item.icon && (
                <FontAwesomeIcon
                  icon={item.icon}
                  style={{ marginRight: "8px" }}
                />
              )}
              {item.text}
            </li>
          </Link>
        ))}
      </ul>
    </li>
  );
}

export default Header;
