import React from "react";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";

function Register() {
    return (
        <React.Fragment>
            <Header />
            <div className="login-form">
                <div className="form-container">
                    <form action="" className="login1">
                        <p>Đăng ký</p>
                        <div className="screen-1">
                            <div className="email">
                                <label htmlFor="email">Email</label>
                                <div className="sec-2">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>
                            <div className="email">
                                <label htmlFor="email">Tài khoản</label>
                                <div className="sec-2">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Tên tài khoản"
                                    />
                                </div>
                            </div>
                            <div className="password">
                                <label htmlFor="password">Mật khẩu</label>
                                <div className="sec-2">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Mật khẩu"
                                    />
                                </div>
                            </div>
                            <div className="password">
                                <label htmlFor="password">
                                    Xác nhận Mật khẩu
                                </label>
                                <div className="sec-2">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Xác nhận Mật khẩu"
                                    />
                                </div>
                            </div>
                            <button className="login">Đăng ký</button>
                            <Link to={"/login"}>
                                <div
                                    className="footer-form"
                                    style={{
                                        textAlign: "center",
                                        background: "red",
                                        display: "block",
                                    }}
                                >
                                    Đăng nhập
                                </div>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default Register;
