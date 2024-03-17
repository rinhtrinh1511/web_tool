import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./profile.scss";
import TextField from "@mui/material/TextField";

function Profile() {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    useEffect(() => {
        const user = localStorage.getItem("userData");

        if (user) {
            const userData = JSON.parse(user);
            setData(userData.user);
        }
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const renderTextField = (label, value, disabled = false , placeholder) => (
        <div className="form-column">
            <label htmlFor={label}>{label}</label>
            <TextField
                id={label}
                name="username"
                variant="outlined"
                value={value || ""}
                fullWidth
                size="small"
                placeholder={placeholder}
                disabled={disabled}
                style={{
                    margin: "0.2rem 0 ",
                    background: disabled ? "#f8fafc" : "white",
                    color: "black",
                    cursor: disabled ? "not-allowed" : "pointer",
                }}
            />
        </div>
    );

    return (
        <React.Fragment>
            <Header />
            <div className="profile-wrap">
                <div className="card">
                    <div className="card-wrap">
                        <header>Thông tin Tài khoản</header>
                        <form action="" className="form-wrap">
                            <div className="form-row">
                                {renderTextField(
                                    "Tên đăng nhập",
                                    data.name,
                                    true,""
                                )}
                                {renderTextField("Địa chỉ Email", data.email)}
                            </div>
                            <div className="form-row">
                                {renderTextField(
                                    "Ngày đăng ký",
                                    data.created_at,
                                    true,""
                                )}
                                {renderTextField("Online gần đây", "1", true,"")}
                            </div>
                            <div className="form-row">
                                {renderTextField("Số dư", data.usd, true,"")}
                                {renderTextField("Số tiền đã nạp", null, true,"")}
                            </div>
                            <div className="form-row">
                                {renderTextField("Số Zalo")}
                            </div>
                            <div className="form-row">
                                <div className="form-column">
                                    <div className="change-form">cập nhật</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="card">
                    <div className="card-wrap">
                        <header>Thay đổi mật khẩu</header>
                        <form action="" className="form-wrap">
                            <div className="form-row">
                                {renderTextField("Mật khẩu cũ", null,false,"Nhập mật khẩu cũ")}
                            </div>
                            <div className="form-row">
                                {renderTextField("Mật khẩu mới", null,false,"Nhập mật khẩu mới")}
                            </div>
                            <div className="form-row">
                                {renderTextField("Xác nhận mật khẩu", null,false,"Nhập mật khẩu mới")}
                            </div>
                            <div className="form-row">
                                <div className="form-column">
                                    <div className="change-form">cập nhật</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default Profile;
