import React from "react";
import "./header.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Header() {
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
                        <Link to={"/"}>Trang chủ</Link>
                    </li>
                    <li className="topup hover-3">
                        <Link to={"/"}>Nạp tiền</Link>
                    </li>
                    <li className="tutorial hover-3">
                        <Link to={"/"}>Hướng dẫn</Link>
                    </li>
                    <li className="history-trade hover-3">
                        <Link to={"/"}>Lịch sử giao dịch</Link>
                    </li>
                </ul>
                <div className="header-login">
                    <Link to={"/login"}>
                        <div className="login rainbow">
                            <FontAwesomeIcon icon={faUser} className="icons" />
                            Đăng nhập
                        </div>
                    </Link>
                    <div className="resgiter rainbow">
                        <Link to={"/"}>Đăng ký</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
