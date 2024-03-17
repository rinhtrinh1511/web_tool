import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getToolDetail } from "../../redux/request/api";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./tool.scss";
import LinearProgress from "@mui/material/LinearProgress";

function ToolDetail() {
    const [progress, setProgress] = useState(0);
    const { id } = useParams();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.tools);
    useEffect(() => {
        getToolDetail(dispatch, id);
        const interval = setInterval(() => {
            setProgress((prevProgress) =>
                prevProgress >= 100 ? 100 : prevProgress + 10
            );
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, [dispatch, id]);

    return (
        <React.Fragment>
            {data.isLoading ? (
                <LinearProgress
                    variant="determinate"
                    color="secondary"
                    value={progress}
                />
            ) : null}
            <Header />
            <div className="tool-detail">
                
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default ToolDetail;
