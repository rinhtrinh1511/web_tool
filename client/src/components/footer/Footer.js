import React from "react";
import "./footer.scss";

function Footer() {
    return (
        <div className="footer" style={{textTransform:"uppercase"}}>
            <div>
                &copy; 2024 | Designed & Developed by
                <a
                    href="https://www.facebook.com/ring.dev123/"
                    style={{ color: "red" }}
                >
                    &nbsp;RING
                </a>
                , POWER BY VISUAL STUDIO
            </div>
        </div>
    );
}

export default Footer;
