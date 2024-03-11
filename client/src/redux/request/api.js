import {
    loginFalse,
    loginStart,
    loginSuccess,
    registerFalse,
    registerStart,
    registerSuccess,
} from "../slice/authSlice";
import axios from "axios";

export const login = async (formData, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("api/v1/login", formData);
        const { name, token } = res.data;
        localStorage.setItem("name", name);
        localStorage.setItem("token", token);
        dispatch(loginSuccess({ name, token }));
        navigate("/");
    } catch (error) {
        dispatch(loginFalse(error.response.data));
    }
};

export const register = async (formData, dispatch, navigate) => {
    dispatch(registerStart());

    try {
        await axios.post("api/v1/register", formData);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(registerFalse(error.response.data));
    }
};
