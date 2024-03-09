import React from "react";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import "./login.scss";
import Footer from "../footer/Footer";

function Login() {
    return (
        <React.Fragment>
            <Header />
            <div className="login-form">
                <div className="form-container">
                    <form action="" className="login1">
                        <p>Đăng nhập</p>
                        <div className="screen-1">
                            <div className="email">
                                <label htmlFor="email">Tài Khoản</label>
                                <div className="sec-2">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Nhập tài Khoản"
                                    />
                                </div>
                            </div>
                            <div className="password">
                                <label htmlFor="password">Mật khẩu</label>
                                <div className="sec-2">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                    />
                                </div>
                            </div>
                            <button className="login">Đăng nhập</button>
                            <div className="footer-form">
                                <Link to={"/register"}>Đăng kí</Link>
                                <Link to={"/"}>Quên mật khẩu?</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default Login;
