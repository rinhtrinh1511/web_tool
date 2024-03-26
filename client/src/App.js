import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./components/home";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Loading from "./components/loading";
import Profile from "./components/profile/Profile";
import ToolDetail from "./components/tool/Tool";
import VpsDetail from "./components/vps/vps";
import "@fontsource/chakra-petch/400.css";
import ATM from "./components/topup/atm/ATM";
import Discount from "./components/discount/Discount";
import Thesieure from "./components/topup/card/Thesieure";
import History from "./components/history/History";
import Active from "./components/active/Active";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
          <Route path="/vps/:id" element={<VpsDetail />} />
          <Route path="/atm" element={<ATM />} />
          <Route path="/card" element={<Thesieure />} />
          <Route path="/discount" element={<Discount />} />
          <Route path="/history" element={<History />} />
          <Route path="/active" element={<Active />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
