import React, { useEffect, useState } from "react";
import "./header.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faCoins,
    faCreditCard,
    faCube,
    faHome,
    faSkullCrossbones,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarespace } from "@fortawesome/free-brands-svg-icons";
function Header() {
    const [name, setName] = useState("");

    useEffect(() => {
        const accessUsername = localStorage.getItem("name");
        if (accessUsername) {
            setName(accessUsername);
        }
    }, []);
    return (
        <div className="a">
            <div className="header-wrap">
                <div className="logo">
                    <Link to={"/"}>
                        <img
                            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/87130cc4-b297-4d4c-8fbf-5a26937514c3/daxn5se-22da1e01-7201-4535-a123-44d391e6bac1.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg3MTMwY2M0LWIyOTctNGQ0Yy04ZmJmLTVhMjY5Mzc1MTRjM1wvZGF4bjVzZS0yMmRhMWUwMS03MjAxLTQ1MzUtYTEyMy00NGQzOTFlNmJhYzEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.px7MSPTjBkT-z7N8UZFJOuV41xYDcDy6d5PdtekTxQg"
                            alt="logo"
                        ></img>
                    </Link>
                </div>
                <ul className="header-mid">
                    <li className="home hover-3">
                        <Link to={"/"}>
                            <FontAwesomeIcon
                                icon={faHome}
                                style={{ marginRight: "4px" }}
                            />
                            Trang chủ
                        </Link>
                    </li>
                    <li className="topup hover-3">
                        <Link to={"/"}>
                            <FontAwesomeIcon
                                icon={faCoins}
                                style={{ marginRight: "4px" }}
                            />
                            xem giảm giá
                        </Link>
                    </li>
                    <li className="tutorial hover-3">
                        <Link to={"/"}>
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                style={{ marginRight: "4px" }}
                            />
                            Nạp tiền
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{ marginLeft: "8px" }}
                            />
                        </Link>
                    </li>
                    <li className="history-trade hover-3">
                        <Link to={"/"}>
                            {" "}
                            <FontAwesomeIcon
                                icon={faCube}
                                style={{ marginRight: "4px" }}
                            />
                            Lịch sử
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{ marginLeft: "8px" }}
                            />
                        </Link>
                    </li>
                    <li className="history-trade hover-3">
                        <Link to={"/"}>
                            <FontAwesomeIcon
                                icon={faSquarespace}
                                style={{ marginRight: "4px" }}
                            />
                            Danh mục khác
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{ marginLeft: "8px" }}
                            />
                        </Link>
                    </li>
                </ul>
                {name ? (
                    <div className="header-login">
                        <Link to={"/profile"}>
                            <div
                                className="login rainbow"
                                style={{ textAlign: "center" }}
                            >
                                <FontAwesomeIcon
                                    icon={faSkullCrossbones}
                                    className="icons"
                                />
                                Xin chào: {name} 
                                <br />
                                SD: 1.000.000&#8363;
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="header-login">
                        <Link to={"/login"}>
                            <div className="login rainbow">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="icons"
                                />
                                Đăng nhập
                            </div>
                        </Link>
                        <div className="resgiter rainbow">
                            <Link to={"/register"}>Đăng ký</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
