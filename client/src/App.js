import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./components/home";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Loading from "./components/loading";
import Profile from "./components/profile/Profile";

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
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
