import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getVPSDetail, purchaseProduct } from "../../redux/request/api";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function VpsDetail() {
    const [data, setData] = useState();
    const [data1, setData1] = useState({});
    const [discount, setDiscount] = useState("");
    const { id } = useParams();
    const [info, setInfo] = useState({
        userId: "",
        productId: "",
        discount: "",
        category: "",
    });
    const dispatch = useDispatch();
    const vpsDetail = useSelector((state) => state.vps);
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
        e.preventDefault();
        purchaseProduct(dispatch, info);
    };

    return (
        <React.Fragment>
            <Header />
            <div className="tool-detail">
                <div className="back">
                    <Link to={"/"}>trang chủ </Link>
                    <FontAwesomeIcon icon={faArrowRight} /> VPS
                </div>
                <div className="detail-product">
                    <div className="header-name">
                        VPS MÁY CHỦ VIỆT NAM CPU e5 2680v4 và gold 6133
                    </div>
                    {data &&
                        Array.isArray(data) &&
                        data.map((item, index) => {
                            const jsonArray = JSON.parse(item.description);
                            const priceFormatted = new Intl.NumberFormat(
                                "vi-VN",
                                {
                                    style: "currency",
                                    currency: "VND",
                                }
                            ).format(item.price);
                            return (
                                <div key={index}>
                                    <div className="name-product">
                                        Tên sản phẩm {item.name}
                                    </div>
                                    {jsonArray.map((core, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <ul className="config">
                                                    <div>
                                                        {Object.entries(
                                                            core
                                                        ).map(
                                                            ([key, value]) => (
                                                                <li
                                                                    key={key}
                                                                    className="core"
                                                                >
                                                                    - {value}
                                                                </li>
                                                            )
                                                        )}
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
                                        <label htmlFor="code">
                                            Mã giảm giá
                                        </label>
                                        <input
                                            id="code"
                                            type="text"
                                            placeholder="Code"
                                            onChange={(e) => {
                                                setDiscount(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="click-buy"
                                        onClick={handleBuy}
                                    >
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

export default VpsDetail;
