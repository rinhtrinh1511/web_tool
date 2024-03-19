import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import { FormControl, MenuItem, Select } from "@mui/material";
import "./thesieure.scss";
import { useDispatch, useSelector } from "react-redux";
import { Topup } from "../../../redux/request/api";

function Thesieure() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.topupCard);
  console.log(data);
  const [infoCard, setInfoCard] = useState({
    telco: " ",
    amount: " ",
    code: "",
    serial: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInfoCard({ ...infoCard, [name]: value });
  };

  const renderMenuItem = (value, label) => (
    <MenuItem key={value} value={value} style={menuItemStyle}>
      {label}
    </MenuItem>
  );

  const renderSelect = (value, name, options) => (
    <div className="form-column">
      <label htmlFor={name}>Loại thẻ</label>
      <FormControl fullWidth size="small">
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          onChange={(e) => setInfoCard({ ...infoCard, [name]: e.target.value })}
          style={selectStyle}
        >
          {options.map((option) => renderMenuItem(option.value, option.label))}
        </Select>
      </FormControl>
    </div>
  );

  const handleTopup = (e) => {
    e.preventDefault();
    Topup(dispatch, infoCard);
  };

  return (
    <React.Fragment>
      <Header />
      <div className="profile-wrap">
        <div className="card">
          <div className="card-wrap">
            <header>Nạp tiền bằng thẻ cào</header>

            <form action="" className="form-wrap">
              <div className="form-row">
                {renderSelect(infoCard.telco, "telco", [
                  { value: " ", label: "chọn loại thẻ" },
                  { value: "VIETTEL", label: "Viettel - phí 16.5%" },
                  { value: "VINAPHONE", label: "mobifone - phí 19%" },
                  { value: "MOBIFONE", label: "vinafone - phí 15%" },
                  { value: "VNMOBI", label: "Vietnammobi - phí 22%" },
                  { value: "ZING", label: "Zing card - phí 11.5%" },
                ])}
              </div>
              <div className="form-row">
                {renderSelect(infoCard.amount, "amount", [
                  { value: " ", label: "chọn mệnh giá" },
                  { value: "10000", label: "10.000đ - nhận" },
                  { value: "20000", label: "20.000 - nhận" },
                  { value: "30000", label: "30.000 - nhận" },
                  { value: "40000", label: "40.000 - nhận" },
                  { value: "50000", label: "50.000 - nhận" },
                  { value: "100000", label: "100.000 - nhận" },
                  { value: "200000", label: "200.000 - nhận" },
                  { value: "500000", label: "500.000 - nhận" },
                  { value: "1000000", label: "1.00.0000 - nhận" },
                ])}
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="code">Mã thẻ</label>
                  <TextField
                    id="code"
                    name="code"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Mã Thẻ"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label htmlFor="serial">Serial</label>
                  <TextField
                    id="serial"
                    name="serial"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Số Serial"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row" onClick={handleTopup}>
                <div className="form-column">
                  <div className="change-form">Nạp thẻ</div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="card">
          <div className="card-wrap">
            <header>Lưu ý</header>
            <div className="ab">
              <p>
                1. Nạp tiền thông qua API của THESIEURE sẽ được duyệt tự động,
                Nhưng sẽ bị trừ chiết khấu của nhà mạng.
              </p>
              <p>
                2. chọn sai mệnh giá sẽ bị trừ 50% giá trị đây là bên THESIEURE
              </p>
              <p>
                3. nạp thẻ quá lâu mà chưa thấy cộng, vui lòng liên hệ admin.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Thesieure;

const selectStyle = {
  fontFamily: "Chakra Petch, sans-serif",
  fontSize: "14px",
  fontWeight: 600,
};

const menuItemStyle = {
  fontFamily: "Chakra Petch, sans-serif",
  fontSize: "14px",
  fontWeight: 600,
};
