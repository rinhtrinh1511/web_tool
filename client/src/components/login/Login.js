import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import "./login.scss";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/request/api";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const data = useSelector((state) => state.auth);

    useEffect(() => {
        setError(data.error);
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, [data, navigate]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        login(formData, dispatch, navigate);
    };

    return (
        <React.Fragment>
            <Header />
            <div className="login-form">
                <div className="form-container">
                    <form className="login1" onSubmit={handleSubmit}>
                        <p>Đăng nhập</p>
                        <div className="screen-1">
                            <div className="email">
                                <label htmlFor="username">Tài khoản</label>
                                <div className="sec-2">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Nhập tài khoản"
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
                                        placeholder="Nhập mật khẩu"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <button className="login" type="submit">
                                Đăng nhập
                            </button>
                            <h4 style={{ textAlign: "center", color: "red" }}>
                                {error}
                            </h4>
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
