import axios from "axios";
import {
  loginFalse,
  loginStart,
  loginSuccess,
  registerFalse,
  registerStart,
  registerSuccess,
} from "../slice/authSlice";

import { getFalse, getStart, getSuccess } from "../slice/tool";
import { getVpsFalse, getVpsStart, getVpsSuccess } from "../slice/vps";
import {
  purchaseFalse,
  purchaseStart,
  purchaseSuccess,
} from "../slice/purchase";
import {
  discountFalse,
  discountStart,
  discountSuccess,
} from "../slice/discount";
import {
  topupCardFalse,
  topupCardStart,
  topupCardSuccess,
} from "../slice/topupCard";
import { historyFalse, historyStart, historySuccess } from "../slice/history";

const API = "";
export const login = async (formData, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API ? API : ""}/api/v1/login`, formData);
    localStorage.setItem("token", res.data.jwtToken);
    dispatch(loginSuccess(res.data));
    localStorage.setItem("userData", JSON.stringify(res.data));
    await getInfo(res.data.jwtToken);
    navigate("/");
  } catch (error) {
    dispatch(loginFalse(error.response.data));
  }
};

export const getInfo = async (token) => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("info", JSON.stringify(res.data));
  } catch (error) {
    console.error("Error:", error);
  }
};

export const register = async (formData, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    const res = await axios.post(`${API ? API : ""}/api/v1/register`, formData);
    dispatch(registerSuccess(res.data));
    navigate("/login");
  } catch (error) {
    dispatch(registerFalse(error.response.data));
  }
};

export const getTool = async (dispatch, token) => {
  dispatch(getStart());
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/tools`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getSuccess(res.data));
  } catch (error) {
    dispatch(getFalse(error.response.data));
  }
};

export const getToolDetail = async (dispatch, id) => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/tool/${id}`);
    return res.data;
  } catch (error) {}
};

export const getVPS = async (dispatch, token) => {
  dispatch(getVpsStart());
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/vps`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getVpsSuccess(res.data));
  } catch (error) {
    dispatch(getVpsFalse(error.response.data));
  }
};

export const getVPSDetail = async (dispatch, id) => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/vps/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const purchaseProduct = async (dispatch, info, token) => {
  dispatch(purchaseStart());
  try {
    const res = await axios.post(`${API ? API : ""}/api/v1/purchase`, info, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(purchaseSuccess(res.data));
  } catch (error) {
    dispatch(purchaseFalse(error.response.data));
  }
};

export const DiscountAll = async (dispatch) => {
  dispatch(discountStart());
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/discount`);
    dispatch(discountSuccess(res.data));
  } catch (error) {
    dispatch(discountFalse(error.response.data));
  }
};

export const Topup = async (dispatch, infoCard) => {
  dispatch(topupCardStart());
  try {
    const res = await axios.post(`${API ? API : ""}/api/v1/topup`, infoCard);
    dispatch(topupCardSuccess(res.data));
  } catch (error) {
    dispatch(topupCardFalse(error.response.data));
  }
};

export const HistoryAll = async (dispatch, id, token) => {
  dispatch(historyStart());
  try {
    const res = await axios.post(
      `${API ? API : ""}/api/v1/history`,
      {
        id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(historySuccess(res.data));
  } catch (error) {
    dispatch(historyFalse(error.response.data));
  }
};

export const getUsd = async (id, token) => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.usd;
  } catch (err) {
    console.log(err);
  }
};

export const getHistoryTopup = async (id, token) => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/topup/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getOS = async () => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/os`);
    return res.data;
  } catch (error) {}
};

export const getProductVPS = async () => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/productvps`);
    return res.data;
  } catch (error) {}
};

export const createOderVPS = async (dispatch, data, token) => {
  dispatch(purchaseStart());
  try {
    const res = await axios.post(`${API ? API : ""}/api/v1/create-vps`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(purchaseSuccess(res.data));
  } catch (err) {
    dispatch(purchaseFalse(err.response.data));
  }
};

export const createOderVPSHash = async (dispatch, data, token) => {
  dispatch(purchaseStart());
  try {
    const res = await axios.post(
      `https://hoangdoanh.com:8080/api/v1/create-vps-hash`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(purchaseSuccess(res.data));
  } catch (err) {
    dispatch(purchaseFalse(err.response.data));
  }
};

export const getSecret_key = async (key) => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/secret/${key}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getHistoryOrderVPS = async (key_id, token) => {
  try {
    const res = await axios.post(
      `${API ? API : ""}/api/v1/history-vps`,
      { key_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const topupCard = async (token) => {
  try {
    const res = await axios.get(`${API ? API : ""}/api/v1/history-mbbank`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getHMB = async (id, token) => {
  try {
    const res = await axios.post(
      `${API ? API : ""}/api/v1/historymbbank`,
      {
        id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const ResetVPS = async (id) => {
  try {
    const res = await axios.post(`${API ? API : ""}/api/v1/action-vps`, {
      id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const ExtendVPS = async (id, key_id) => {
  try {
    const res = await axios.post(`${API ? API : ""}/api/v1/extend-vps`, {
      id,
      key_id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
