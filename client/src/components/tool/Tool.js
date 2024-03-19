import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getToolDetail, purchaseProduct } from "../../redux/request/api";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./tool.scss";
import Swal from "sweetalert2";

function ToolDetail() {
  const [data, setData] = useState();
  const [data1, setData1] = useState({});
  const [discount, setDiscount] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { id } = useParams();
  const [info, setInfo] = useState({
    userId: "",
    productId: "",
    discount: "",
    category: "",
  });
  const dispatch = useDispatch();
  const toolDetail = useSelector((state) => state.tools);
  const purchase = useSelector((state) => state.purchase);
  useEffect(() => {
    if (id) {
      getToolDetail(dispatch, id);
    }
  }, [dispatch, id]);
  useEffect(() => {
    const user = localStorage.getItem("userData");
    const userData = JSON.parse(user);
    if (user) {
      setData1(userData.user);
    }
    setInfo({
      productId: id,
      userId: data1.id,
      discount: discount,
      category: "tools",
    });
    setData(toolDetail.tool);
  }, [id, toolDetail.tool, data1.id, discount]);

  const handleBuy = (e) => {
    e.preventDefault();
    purchaseProduct(dispatch, info);
    setIsPurchasing(true);
  };
  useEffect(() => {
    if (isPurchasing) {
      const timer = setTimeout(() => {
        if (purchase.isSuccess) {
          Swal.fire({
            title: "Thanh toán thành công.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: purchase.error.error,
            icon: "error",
          });
        }
        setIsPurchasing(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPurchasing, purchase.isSuccess, purchase.error.error]);
  return (
    <React.Fragment>
      <Header />
      <div className="tool-detail">
      
        <div className="detail-product">
          <div className="header-name">TOOL NGỌC RỒNG</div>
          {data &&
            Array.isArray(data) &&
            data.map((item, index) => {
              const jsonArray = JSON.parse(item.description);
              const priceFormatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price);
              return (
                <div key={index}>
                  <div className="name-product">Tên sản phẩm {item.name}</div>
                  {jsonArray.map((core, index) => {
                    return (
                      <React.Fragment key={index}>
                        <ul className="config">
                          <div>
                            {Object.entries(core).map(([key, value]) => (
                              <li key={key} className="core">
                                - {value}
                              </li>
                            ))}
                          </div>

                          <img
                            src="https://img.zing.vn/upload/gn/source/2018/T72018/Ban%20nang%20vo%20cuc.png"
                            alt=""
                            style={{ width: "60%", borderRadius: "8px" }}
                          />
                        </ul>
                        <div className="price-product">
                          Giá ưu đãi: {priceFormatted}
                        </div>
                      </React.Fragment>
                    );
                  })}

                  <div className="code">
                    <label htmlFor="code">Mã giảm giá</label>
                    <input
                      id="code"
                      type="text"
                      placeholder="Code"
                      onChange={(e) => {
                        setDiscount(e.target.value);
                      }}
                    />
                  </div>
                  <div className="click-buy" onClick={handleBuy}>
                    <span>Mua Ngay</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default ToolDetail;
