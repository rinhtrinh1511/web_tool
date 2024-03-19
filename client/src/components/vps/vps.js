import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVPSDetail, purchaseProduct } from "../../redux/request/api";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Swal from "sweetalert2";

function VpsDetail() {
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
  const vpsDetail = useSelector((state) => state.vps);
  const purchase = useSelector((state) => state.purchase);

  useEffect(() => {
    if (id) {
      getVPSDetail(dispatch, id);
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
      category: "vps",
    });
    setData(vpsDetail.vps);
  }, [id, vpsDetail.vps, data1.id, discount]);

  const handleBuy = (e) => {
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
          <div className="header-name">
            VPS MÁY CHỦ VIỆT NAM CPU e5 2680v4 và gold 6133
          </div>
          {data &&
            Array.isArray(data) &&
            data.map((item, index) => {
              let priceFormatted;
              let check;
              if (item.price === 0) {
                priceFormatted = "Lh admin";
                check = false;
              } else {
                priceFormatted = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price);
                check = true;
              }
              const jsonArray = JSON.parse(item.description);

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
                            alt=""
                            src="https://cloudmini.net/wp-content/uploads/2023/04/virtual-private-server-png.png"
                          ></img>
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
                  {check ? (
                    <div className="click-buy" onClick={handleBuy}>
                      <span>Mua Ngay</span>
                    </div>
                  ) : (
                    <a href="https://www.facebook.com/ring.dev123/">
                      <div className="click-buy">
                        <span>inbox</span>
                      </div>
                    </a>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default VpsDetail;
