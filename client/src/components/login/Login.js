import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import "./login.scss";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/request/api";
import { TextField, Button } from "@mui/material";

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
                            <TextField
                                id="outlined-basic"
                                label="Tài khoản"
                                name="username"
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                                style={{ height: "80px" }}
                            />

                            <TextField
                                id="outlined-basic1"
                                label="Mật khẩu"
                                name="password"
                                type="password"
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                                style={{ height: "80px" }}
                            />

                            <Button variant="contained" type="submit" fullWidth>
                                Đăng nhập
                            </Button>
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
