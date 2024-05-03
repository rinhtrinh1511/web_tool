import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/request/api";
import { Button, TextField } from "@mui/material";
import Swal from "sweetalert2";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitClicked, setSubmitClicked] = useState(false);
  const { err: errorMessage } = useSelector((state) => state.auth);
  // const data = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(formData, dispatch, navigate);
    setSubmitClicked(true);
  };
  useEffect(() => {
    if (!errorMessage) {
      Toast.fire({
        icon: "success",
        title: "Đăng kí thành công",
      });
    }
    if (submitClicked) {
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
    setSubmitClicked(false);
  }, [submitClicked, errorMessage, Toast]);
  return (
    <React.Fragment>
      <Header />
      <div className="login-form">
        <div className="form-container">
          <form className="login1" onSubmit={handleSubmit}>
            <p>ĐĂNG KÝ</p>
            <div className="screen-1">
              <TextField
                id="outlined-basic5"
                label={<span className="custom-label">email</span>}
                name="email"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                style={{ height: "80px" }}
                InputProps={{
                  style: {
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                }}
              />

              <TextField
                id="outlined-basic4"
                label={<span className="custom-label">tài khoản</span>}
                name="username"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                style={{ height: "80px" }}
                InputProps={{
                  style: {
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                }}
              />
              <TextField
                id="outlined-basic3"
                label={<span className="custom-label">Mật khẩu</span>}
                name="password"
                type="password"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                style={{ height: "80px" }}
                InputProps={{
                  style: {
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                }}
              />
              <TextField
                id="outlined-basic2"
                label={<span className="custom-label">xác nhận Mật khẩu</span>}
                name="confirmPassword"
                type="password"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                style={{ height: "80px" }}
                InputProps={{
                  style: {
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                }}
              />
              <Button
                variant="contained"
                type="submit"
                fullWidth
                style={{
                  fontFamily: "Chakra Petch, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Đăng ký
              </Button>
              {/* <h4 style={{ textAlign: "center", color: "red" }}>
                {errorMessage}
              </h4> */}
              <Link to={"/login"}>
                <div
                  className="footer-form"
                  style={{
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      fontFamily: "Chakra Petch, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
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
