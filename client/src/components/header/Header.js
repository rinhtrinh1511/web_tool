import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faBell,
  faCode,
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
import { resetState } from "../../redux/slice/authSlice";
import { getUsd } from "../../redux/request/api";
import logo from "../../img/logo1.png";

function Header() {
  const [info, setInfo] = useState({});
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
    dispatch(resetState());
    localStorage.removeItem("token");
    localStorage.removeItem("info");
    navigate("/login");
  };
  useEffect(() => {
    const info = localStorage.getItem("info");
    const token = localStorage.getItem("token");
    const key = JSON.parse(info);
    const fetchData = async () => {
      await getUsd(key.key_id, token).then((data) => {
        setUsd(data);
      });
    };
    if (info) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const infoString = localStorage.getItem("info");
    if (infoString) {
      const info = JSON.parse(infoString);
      setInfo(info);
    }
  }, []);
  const priceFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(usd);

  // function isMobileDevice() {
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //     navigator.userAgent
  //   );
  // }
  // if (isMobileDevice()) {
  //   console.log(
  //     "Thiết bị truy cập là một điện thoại di động hoặc máy tính bảng."
  //   );
  // } else {
  //   console.log("Thiết bị truy cập là một máy tính.");
  // }

  const renderAuthSection = () => {
    if (localStorage.getItem("token")) {
      return (
        <>
          <div className="header-login ax1 " id="header-login">
            <div className="login rainbow" onClick={handleNavClick}>
              <FontAwesomeIcon icon={faCode} /> Xin chào: {info.username}
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
        </>
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
      <div className="pc-warning">
        Website dành cho PC(khuyến cáo 1920x1080px). <br />
        Vui lòng mở PC để có trải nghiệm tốt nhất.
        <br />
        <div>
          developer by
          <a
            href="https://www.facebook.com/ring.dev123/"
            style={{ color: "red" }}
          >
            &nbsp;RING&nbsp;
          </a>
        </div>
      </div>
      {showToast && (
        <div className="toast">
          <div className="form-toast">
            <div className="header-toast">
              <label htmlFor="">
                <FontAwesomeIcon icon={faBell} style={{ marginRight: 4 }} />
                Thông báo <FontAwesomeIcon icon={faCode} />
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
                <span style={{ fontWeight: 600 }} className="blink">
                  ĐÉO
                </span>
                <br />
                <a href="https://www.facebook.com/ring.dev123/">
                  Facebook (Rinh)
                </a>
                {" hoặc "}
                zalo 0969938892.
              </span>
              <br />
              <span>
                Trong quá trình sử dụng dịch vụ có lỗi vui lòng liên hệ
                <br />
                <a href="https://www.facebook.com/Hoangdoanh.com.vn">
                  Facebook (Hoàng Doanh)
                </a>
                {" hoặc "}
                zalo 0332692526.
              </span>
              <br />
              <span
                style={{ fontWeight: 600, fontSize: 16 }}
                className="blink blink1"
              >
                Website cung cấp VPS tự động. Thông tin sẽ được gửi đến lịch sử.
                <br />
                sau khi đã đặt hàng thành công liên hệ{" "}
                <a href="https://www.facebook.com/DoanhHoang.0332692526">
                  <span style={{ fontWeight: 600, fontSize: 16, color: "red" }}>
                    Doanh
                  </span>
                </a>{" "}
                để cài tool
              </span>
              <br />
              <span>Proxy sẽ được update trong thời gian tới.</span>
              <br />
              {/* <span className="blink">Ở đây không phải thiên đình.</span>
              <br />
              <span className="blink">
                Nên đừng ảo tưởng mình là thượng đế.
              </span> */}
              <span>mở Website bằng PC/Laptop để có trải nghiệm tốt nhất</span>
              <br />

              <span>Thanks All.</span>
              <div className="marquee-container">
                <span className="marquee">╭∩╮( •̀_•́ )╭∩╮</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="a">
        <div className="header-wrap">
          <div className="logo">
            <Link to={"/"}>
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <ul className="header-mid" id="header-mid">
            <NavItem icon={faHome} text="Trang chủ" to="/" />
            <NavItem icon={faCoins} text="Mã giảm giá" to="/discount" />
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
                { text: "Mua VPS tùy chọn", to: "/vps-option" },
                { text: "Tool phá làng, phá xóm" },
              ]}
              to="/atm"
            />
          </ul>
          {renderAuthSection()}
        </div>
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
