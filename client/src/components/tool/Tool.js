import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getToolDetail, purchaseProduct } from "../../redux/request/api";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./tool.scss";
function VpsDetail() {
    const [data, setData] = useState();
    const [data1, setData1] = useState({});
    const [discount, setDiscount] = useState("");
    const { id } = useParams();
    const [info, setInfo] = useState({
        userId: "",
        productId: "",
        discount: "",
        category:""
    });
    const dispatch = useDispatch();
    const toolDetail = useSelector((state) => state.tools);
    console.log(toolDetail.tool);
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
            category:"tools"
        });
        setData(toolDetail.tool);
    }, [id, toolDetail.tool, data1.id, discount]);

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
                    <FontAwesomeIcon icon={faArrowRight} /> Tool
                </div>
                <div className="detail-product">
                    <div className="header-name">
                        TOOL NGỌC RỒNG
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
                                                   
                                                    <img src="https://img.zing.vn/upload/gn/source/2018/T72018/Ban%20nang%20vo%20cuc.png" alt="" style={{width:"60%",borderRadius:"8px"}} />
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
