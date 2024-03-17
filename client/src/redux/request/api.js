import axios from "axios";
import {
    loginFalse,
    loginStart,
    loginSuccess,
    registerFalse,
    registerStart,
    registerSuccess,
} from "../slice/authSlice";

import {
    getDetailFalse,
    getDetailStart,
    getDetailSuccess,
    getFalse,
    getStart,
    getSuccess,
} from "../slice/tool";
import {
    getVpsDetailFalse,
    getVpsDetailStart,
    getVpsDetailSuccess,
    getVpsFalse,
    getVpsStart,
    getVpsSuccess,
} from "../slice/vps";
import {
    purchaseFalse,
    purchaseStart,
    purchaseSuccess,
} from "../slice/purchase";

export const login = async (formData, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/api/v1/login", formData);
        localStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(res.data));
        localStorage.setItem("userData", JSON.stringify(res.data));
        navigate("/");
    } catch (error) {
        dispatch(loginFalse(error.response.data));
    }
};

export const register = async (formData, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/api/v1/register", formData);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(registerFalse(error.response.data));
    }
};

export const getTool = async (dispatch) => {
    dispatch(getStart());
    try {
        const res = await axios.get("/api/v1/tools");
        dispatch(getSuccess(res.data));
    } catch (error) {
        dispatch(getFalse(error.response.data));
    }
};

export const getToolDetail = async (dispatch, id) => {
    dispatch(getDetailStart());
    try {
        const res = await axios.get(`/api/v1/tool/${id}`);
        dispatch(getDetailSuccess(res.data));
    } catch (error) {
        dispatch(getDetailFalse());
    }
};

export const getVPS = async (dispatch) => {
    dispatch(getVpsStart());
    try {
        const res = await axios.get("/api/v1/vps");
        dispatch(getVpsSuccess(res.data));
    } catch (error) {
        dispatch(getVpsFalse(error.response.data));
    }
};

export const getVPSDetail = async (dispatch, id) => {
    dispatch(getVpsDetailStart());
    try {
        const res = await axios.get(`/api/v1/vps/${id}`);
        dispatch(getVpsDetailSuccess(res.data));
    } catch (error) {
        dispatch(getVpsDetailFalse());
    }
};

export const purchaseProduct = async (dispatch, info) => {
    dispatch(purchaseStart());
    try {
        const res = await axios.post("/api/v1/purchase", info);
        console.log();
        localStorage.setItem("userData", JSON.stringify(res.data));
        dispatch(purchaseSuccess(res.data));
    } catch (error) {
        dispatch(purchaseFalse());
    }
};
