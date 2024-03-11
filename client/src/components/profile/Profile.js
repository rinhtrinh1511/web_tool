import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./profile.scss";
function Profile() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    });
    return (
        <React.Fragment>
            <Header />
            <div className="profile-wrap">
                <h2>User Profile</h2>
                <table className="profile-table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>1</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>1</td>
                        </tr>
                       
                    </tbody>
                </table>
                <button></button>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default Profile;
