import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { createOderVPS, getOS, getProductVPS } from "../../redux/request/api";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "./optionvps.scss";
import Swal from "sweetalert2";

function OptionVPS() {
  const [os, setOS] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOS, setSelectedOS] = useState("");
  const [selectedVPS, setSelectedVPS] = useState("");
  const [selectTimeVPS, setSelectTimeVPS] = useState("");
  const [timeVPS, setTimeVPS] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [disable, setDisable] = useState(true);
  const user = localStorage.getItem("userData");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const dispatch = useDispatch();
  const [dataOder, setDataOder] = useState({
    product_id: "",
    billing_cycle: "",
    os: "",
    quantity: 1,
    addon_cpu: 0,
    addon_ram: 0,
    addon_disk: 0,
    key_id: "",
  });
  const purchase = useSelector((state) => state.purchase);
  useState(() => {
    const userData = JSON.parse(user);
    if (user) {
      setDataOder((prevInfoCard) => ({
        ...prevInfoCard,
        key_id: userData.user.key,
      }));
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOS();
        setOS(data);
      } catch (error) {
        console.error("Error fetching OS data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await getProductVPS();
        const vpsProducts = response.products.vps;
        const addonProducts = response.products.addon_vps.reduce(
          (acc, group) => {
            return [...acc, ...group.product];
          },
          []
        );
        // setCombinedProducts([...vpsProducts, ...addonProducts]);
        if ([...vpsProducts, ...addonProducts].length > 0) {
          setProducts([...vpsProducts, ...addonProducts][0].product);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getdata();
  }, []);

  useEffect(() => {
    if (selectedVPS && selectTimeVPS) {
      const selectedProduct = Object.values(products).find(
        (product) => product.product_id === selectedVPS
      );

      if (selectedProduct) {
        const amount = getAmountByBillingCycle(selectedProduct, selectTimeVPS);
        if (amount !== null) {
          setSelectedPrice(amount);
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }, [selectedVPS, selectTimeVPS, products]);
  const handlechangTimeVPS = (e) => {
    const { name, value } = e.target;
    setSelectTimeVPS(e.target.value);
    setDataOder({ ...dataOder, [name]: value });
  };
  const handleChangeOS = (e) => {
    const { name, value } = e.target;
    setSelectedOS(e.target.value);
    setDataOder({ ...dataOder, [name]: value });
  };
  const handleChangeVPS = (e) => {
    setSelectedVPS(e.target.value);
    const productId = e.target.value;
    const selectedProduct = Object.values(products).find(
      (product) => product.product_id === productId
    );
    setDataOder({
      ...dataOder,
      product_id: productId,
      addon_cpu: selectedProduct.cpu,
      addon_disk: selectedProduct.disk,
      addon_ram: selectedProduct.ram,
    });

    if (selectedProduct) {
      setDisable(false);
      setTimeVPS(selectedProduct.pricing);
    } else {
      setDisable(true);
      return;
    }
  };
  const getAmountByBillingCycle = (product, billingCycle) => {
    if (!billingCycle || !product || !product.pricing) {
      return null;
    }
    switch (billingCycle) {
      case "1 Tháng":
        return product.pricing.monthly.amount;
      case "2 Tháng":
        return product.pricing.twomonthly.amount;
      case "3 Tháng":
        return product.pricing.quarterly.amount;
      case "6 Tháng":
        return product.pricing.semi_annually.amount;
      case "1 Năm":
        return product.pricing.annually.amount;
      case "2 Năm":
        return product.pricing.biennially.amount;
      case "3 Năm":
        return product.pricing.triennially.amount;
      default:
        return null;
    }
  };
  const [value, setValue] = useState(1);

  const handleChanges = (e) => {
    let inputValue = e.target.value ? e.target.value : 1;
    setDataOder({ ...dataOder, quantity: parseInt(inputValue) });
    if (isNaN(inputValue) || inputValue < 1) {
      inputValue = 1;
    }

    setValue(inputValue);
  };
  const handleOrder = async (e) => {
    try {
      await createOderVPS(dispatch, dataOder);
      setIsPurchasing(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isPurchasing) {
      if (!purchase.error) {
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
  //   if (isToup) {
  //     const timer = setTimeout(() => {
  //       if (data.isSuccess) {
  //         if (data.data.status === 99) {
  //           Swal.fire({
  //             title: data.data.message,
  //             icon: "success",
  //           });
  //         } else {
  //           Swal.fire({
  //             title: data.data.message,
  //             icon: "error",
  //           });
  //         }
  //       } else {
  //         Swal.fire({
  //           title: data.error,
  //           icon: "error",
  //         });
  //       }
  //       setIsTopUp(false);
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   }
  // });
  return (
    <React.Fragment>
      <Header />
      <div className="option-vps">
        <div className="vps-option">
          <label htmlFor="" style={{ fontSize: 20, color: "tomato" }}>
            Cấu hình vps tùy chọn
          </label>
          <FormControl
            fullWidth
            size="small"
            sx={{
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <InputLabel
              id="demo-select-small-label1"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Chọn hệ điều hành
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectedOS}
              label="Chọn hệ điều hành"
              name={"os"}
              onChange={handleChangeOS}
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {os.map((os) => {
                return (
                  <MenuItem
                    key={os["os-id"]}
                    value={os["os-id"]}
                    style={{
                      fontFamily: "Chakra Petch, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {os["os-name"]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            size="small"
            sx={{
              marginBottom: 3,
            }}
          >
            <InputLabel
              id="demo-select-small-label2"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Chọn VPS
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectedVPS}
              label="Chọn VPS"
              name={"product_id"}
              onChange={handleChangeVPS}
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {Object.values(products).map((product, index) => (
                <MenuItem
                  key={index}
                  value={product.product_id}
                  style={{
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            size="small"
            sx={{
              marginBottom: 3,
            }}
          >
            <InputLabel
              id="demo-select-small-label2"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              số tháng
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectTimeVPS}
              label="số tháng"
              name={"billing_cycle"}
              onChange={handlechangTimeVPS}
              disabled={disable}
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {Object.values(timeVPS).map((time, index) => (
                <MenuItem
                  key={index}
                  value={time.billing_cycle}
                  style={{
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {time.billing_cycle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="number"
            value={value}
            onChange={handleChanges}
            placeholder="số lượng"
            size="small"
            inputProps={{ min: 1 }}
            inputMode="numeric"
            sx={{ marginRight: 8, width: 120 }}
          />

          <Button
            variant="contained"
            onClick={handleOrder}
            style={{
              fontFamily: "Chakra Petch, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {selectedPrice ? selectedPrice + " đ" : "Không có gì cả"}
          </Button>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
}

export default OptionVPS;
