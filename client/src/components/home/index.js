import React from "react";
import "./home.scss";
import Header from "../header/Header";
import Main from "../main/Main";
import Footer from "../footer/Footer";

function HomePage() {
  return (
    <div className="home-wrap">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default HomePage;
