import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./discount.scss";

function Discount() {
    return (
        <React.Fragment>
            <Header />
            <div className="discount">
                <p>Mã giảm giá</p>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mã giảm giá</th>
                            <th>Tổng giảm giá</th>
                            <th>Thể loại</th>
                            <th>Còn lại</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td>1</td>
                        <td style={{ color: "#21dd21", fontWeight: "600" }}>
                            RINHDZ
                        </td>
                        <td style={{ fontWeight: "600" }}>5%</td>
                        <td style={{ fontWeight: "600" }}>tất cả</td>
                        <td style={{ color: "red", fontWeight: "600" }}>5 Lượt</td>
                    </tbody>
                </table>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default Discount;
