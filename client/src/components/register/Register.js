import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/request/api";
import { Button, TextField } from "@mui/material";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { err: errorMessage } = useSelector((state) => state.auth);

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
                            <TextField
                                id="outlined-basic5"
                                label="Email"
                                name="email"
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                                style={{ height: "80px" }}
                            />

                            <TextField
                                id="outlined-basic4"
                                label="Tài khoản"
                                name="username"
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                                style={{ height: "80px" }}
                            />
                            <TextField
                                id="outlined-basic3"
                                label="Mật khẩu"
                                name="password"
                                type="password"
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                                style={{ height: "80px" }}
                            />
                            <TextField
                                id="outlined-basic2"
                                label="Xác nhận Mật khẩu"
                                name="confirmPassword"
                                type="password"
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                                style={{ height: "80px" }}
                            />
                            <Button variant="contained" type="submit" fullWidth>
                                Đăng ký
                            </Button>
                            <h4 style={{ textAlign: "center", color: "red" }}>
                                {errorMessage}
                            </h4>
                            <Link to={"/login"}>
                                <div
                                    className="footer-form"
                                    style={{
                                        textAlign: "center",
                                        display: "block",
                                    }}
                                >
                                    <Button variant="contained" fullWidth>
                                        đăng nhập
                                    </Button>
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
