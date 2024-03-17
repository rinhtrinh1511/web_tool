import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faCoins,
    faCreditCard,
    faCube,
    faHome,
    faLandmark,
    faSkullCrossbones,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarespace } from "@fortawesome/free-brands-svg-icons";
import "./header.scss";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";

function Header() {
    const [data, setData] = useState({});
    const [isNavOpen, setIsNavOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleNavClick = () => {
        setIsNavOpen(!isNavOpen);
    };
    const logout1 = () => {
        logout(dispatch);
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        navigate("/login");
    };
    useEffect(() => {
        const user = localStorage.getItem("userData");
        const userData = JSON.parse(user);
        if (user) {
            setData(userData.user);
        }
    }, []);
    const priceFormatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(data.usd);
    const renderAuthSection = () => {
        if (localStorage.getItem("userData")) {
            return (
                <div className="header-login ax1">
                    <div className="login rainbow" onClick={handleNavClick}>
                        <FontAwesomeIcon
                            icon={faSkullCrossbones}
                            className="icons"
                        />
                        Xin chào: {data.name}
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

    return (
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
                        { text: "1. Biến động số dư" },
                        { text: "2. Tải lịch sử mua" },
                    ]}
                    to="/atm"
                />
                <NavItemWithDropdown
                    icon={faSquarespace}
                    text="Danh mục khác"
                    items={[
                        { text: "Proxy" },
                        { text: "Gia hạn vps" },
                        { text: "Tool phá làng, phá xóm" },
                    ]}
                    to="/atm"
                />
            </ul>
            {renderAuthSection()}
        </div>
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
