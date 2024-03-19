import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./discount.scss";
import { useDispatch, useSelector } from "react-redux";
import { DiscountAll } from "../../redux/request/api";
function Discount() {
  const [discount, setDiscount] = useState("");
  const dispatch = useDispatch();
  const discounts = useSelector((state) => state.discount);
  useEffect(() => {
    const fetchData = async () => {
      await DiscountAll(dispatch);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!discounts.isLoading) {
      setDiscount(discounts.discount);
    }
  }, [discounts, setDiscount]);
  console.log(discount);
  return (
    <React.Fragment>
      <Header />
      <div className="discount">
        <p style={{ fontSize: "20px", fontWeight: "600" }}>Mã giảm giá</p>
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
            {Object.values(discount).map((discount, index) => {
              return (
                <tr key={index}>
                  <td>{discount.id}</td>
                  <td style={{ color: "#21dd21", fontWeight: "600" }}>
                    {discount.name}
                  </td>
                  <td style={{ fontWeight: "600" }}>
                    {discount.total_discount}%
                  </td>
                  <td style={{ fontWeight: "600" }}>{discount.category}</td>
                  <td style={{ color: "tomato", fontWeight: "600" }}>
                    {discount.remaining_usage} Lượt
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Discount;
