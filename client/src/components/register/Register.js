import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/request/api";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const mes = useSelector((state) => state.auth);
    useEffect(() => {
        setError(mes.err);
    }, [mes]);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        register(formData, dispatch, navigate);
    };

    return (
        <React.Fragment>
            <Header />
            <div className="login-form">
                <div className="form-container">
                    <form className="login1" onSubmit={handleSubmit}>
                        <p>Đăng ký</p>
                        <div className="screen-1">
                            <div className="email">
                                <label htmlFor="email">Email</label>
                                <div className="sec-2">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="email">
                                <label htmlFor="username">Tài khoản</label>
                                <div className="sec-2">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Tên tài khoản"
                                        onChange={handleChange}
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
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="password">
                                <label htmlFor="confirmPassword">
                                    Xác nhận Mật khẩu
                                </label>
                                <div className="sec-2">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Xác nhận Mật khẩu"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <button className="login" type="submit">
                                Đăng ký
                            </button>
                            <h4 style={{ textAlign: "center", color: "red" }}>
                                {error}
                            </h4>
                            <Link to={"/login"}>
                                <div
                                    className="footer-form"
                                    style={{
                                        textAlign: "center",
                                        display: "block",
                                    }}
                                >
                                    <button className="login">Đăng nhập</button>
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
