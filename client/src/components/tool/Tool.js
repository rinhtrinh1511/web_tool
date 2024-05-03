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
  const [discount, setDiscount] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const [info, setInfo] = useState({
    userId: "",
    productId: "",
    discount: "",
    category: "",
  });
  const dispatch = useDispatch();
  const purchase = useSelector((state) => state.purchase);
  const { id } = useParams();
  const user = localStorage.getItem("info");
  const userData = JSON.parse(user);
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getToolDetail(dispatch, id).then((data) => {
          setData(data);
        });
      }
    };
    fetchData();
  }, [dispatch, id]);
  useEffect(() => {
    setInfo({
      userId: userData.key_id,
      productId: id,
      discount: discount,
      category: "tools",
    });
  }, [id, discount, userData.key_id]);

  const handleBuy = async (e) => {
    await purchaseProduct(dispatch, info, localStorage.getItem("token"));
    setIsPurchasing(true);
  };
  useEffect(() => {
    if (isPurchasing) {
      if (purchase.error === "Thanh toán thành công") {
        Swal.fire({
          text: purchase.error,
          icon: "success",
        });
      } else {
        Swal.fire({
          text: purchase.error,
          icon: "error",
        });
      }
      setIsPurchasing(false);
    }
  }, [isPurchasing, purchase.isSuccess, purchase.error.error, purchase.error]);
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
                            loading="lazy"
                            src="https://dbgbh.bn-ent.net/archive/2022/assets/img/shared/mainvisual_pc.png"
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
