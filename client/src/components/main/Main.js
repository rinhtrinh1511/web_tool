import React, { useEffect, useState } from "react";
import "./main.scss";
import { useDispatch, useSelector } from "react-redux";
import { getTool } from "../../redux/request/api";
import { getVPS } from "../../redux/request/api";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material";

function Main() {
  const [isFetched, setIsFetched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tool, setTool] = useState([]);
  const [vps, setVps] = useState([]);
  const dispatch = useDispatch();
  const tools = useSelector((state) => state.tools);
  const vpss = useSelector((state) => state.vps);

  useEffect(() => {
    setTool(tools.tool);
    setVps(vpss.vps);
    if (!isFetched) {
      getTool(dispatch);
      getVPS(dispatch);
      setIsFetched(true);
    }
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + 10
      );
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, isFetched, tools, vpss]);
  return (
    <React.Fragment>
      {tools.isLoading ? (
        <LinearProgress
          variant="determinate"
          color="secondary"
          value={progress}
        />
      ) : null}
      <div className="main-wrap">
        <div className="allTool-title">
          <div className="aTool-container-title">
            <div className="box-allTool">
              <h1>Danh Mục Tool</h1>
            </div>
            <div className="allTool-gradient-border"></div>
          </div>
        </div>

        <div className="box-product-tool">
          {tool &&
            Array.isArray(tool) &&
            tool.map((item, index) => {
              const priceFormatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price);
              return (
                <div className="box-slider" key={index}>
                  <div className="slider-tool">
                    <div className="img">
                      <img
                        src="https://dblegends.net/assets/gasha/gasha_2009600.webp"
                        alt="logo"
                      />
                    </div>
                    <div className="name-tool">{item.name}</div>
                    <div className="price">Giá {priceFormatted}/1</div>
                    <div className="price-count">
                      Số lượt mua: {item.download_count}
                    </div>
                    <Link to={`/tool/${item.id}`}>
                      <div className="view-tool">Quất luôn</div>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="allTool-title">
          <div className="aTool-container-title">
            <div className="box-allTool">
              <h1>Danh Mục VPS</h1>
            </div>
            <div className="allTool-gradient-border"></div>
          </div>
        </div>
        <div className="box-produect-vps box-product-tool">
          {vps &&
            Array.isArray(vps) &&
            vps.map((item, index) => {
              let priceFormatted;
              if (item.price === 0) {
                priceFormatted = "thương lượng";
              } else {
                priceFormatted = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price);
                priceFormatted += "/1 tháng";
              }

              return (
                <div className="box-slider" key={index}>
                  <div className="slider-tool">
                    <div className="img">
                      <img
                        src="https://www.global-dms.com/wp-content/uploads/2022/04/vps-hosting.png"
                        alt="logo"
                      />
                    </div>
                    <div className="name-tool">{item.name}</div>
                    <div className="price">Giá {priceFormatted}</div>
                    <div className="price-count">
                      Số lượt mua: {item.purchases_count}
                    </div>
                    <Link to={`/vps/${item.id}`}>
                      <div className="view-tool">Quất luôn</div>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Main;
