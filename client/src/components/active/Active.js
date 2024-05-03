import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./active.scss";
import { Button, TextField } from "@mui/material";

function Active() {
  return (
    <React.Fragment>
      <Header />
      <div className="active">
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="">Kích hoạt key Ngọc rồng online</label>
        </div>

        <TextField
          id="outlined-basic"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Key cũ"
          style={{ height: "52px" }}
          InputProps={{
            style: {
              fontFamily: "Chakra Petch, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
        <TextField
          id="outlined-basic1"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Key mới"
          style={{ height: "52px" }}
          InputProps={{
            style: {
              fontFamily: "Chakra Petch, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
        <Button
          variant="contained"
          type="submit"
          style={{
            fontFamily: "Chakra Petch, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          thay đổi
        </Button>
      </div>
      <Footer />
    </React.Fragment>
  );
}
export default Active;
