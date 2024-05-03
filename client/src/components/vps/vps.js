import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createOderVPSHash, getVPSDetail } from "../../redux/request/api";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Swal from "sweetalert2";
import vps_detail from "../../img/vps-detail.png";
function VpsDetail() {
  const [data, setData] = useState();
  const [data1, setData1] = useState({});
  const [discount, setDiscount] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { id } = useParams();
  const [dataPost, setDataPost] = useState({
    id: "",
    key_id: "",
  });
  const dispatch = useDispatch();
  const purchase = useSelector((state) => state.purchase);
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getVPSDetail(dispatch, id).then((data) => {
          setData(data);
        });
      }
    };
    fetchData();
  }, [dispatch, id]);
  useEffect(() => {
    const user = localStorage.getItem("userData");
    const userData = JSON.parse(user);
    if (user) {
      setDataPost({ key_id: userData.user.key, id: id });
      setData1(userData.user);
    }
  }, [id, data1.id, discount]);

  const handleBuy = async (e) => {
    // purchaseProduct(dispatch, info);
   await createOderVPSHash(dispatch, dataPost, localStorage.getItem("token"));
    setIsPurchasing(true);
  };
  useEffect(() => {
    if (isPurchasing) {
      if (purchase.isSuccess) {
        Swal.fire({
          text: "Thanh toán thành công.",
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
  }, [isPurchasing, purchase.isSuccess, purchase.error, dispatch]);
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
              const jsonArray = JSON.parse(item.description);
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

                          <img loading="lazy" alt="" src={vps_detail}></img>
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
