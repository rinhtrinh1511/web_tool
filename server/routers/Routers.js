const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");

//____________get____________//

router.get("/tools", Controller.getTool);

router.get("/tool/:id", Controller.getToolDetail);

router.get("/vps", Controller.getVPS);

router.get("/vps/:id", Controller.getVPSDetail);

router.get("/user/:id", Controller.getUSD);

router.get("/discount", Controller.getDiscount);

router.get("/topup/:id", Controller.getHistoryTopup);

router.get("/secret/:id", Controller.getSecret);

router.get("/history-mbbank", Controller.getHistoryMBBank);

router.get("/info", Controller.getInfo);

//____________post____________//

router.post("/login", Controller.login);

router.post("/register", Controller.register);

router.post("/topup", Controller.topUpTheSieuRe);

router.post("/purchase", Controller.purchase);

router.post("/history", Controller.History);

router.post("/historymbbank", Controller.getHistoryATM);

router.post("/history-vps", Controller.getOrderVPSCloud);

// router.post("/cloudnetvps", Controller.VPSConnect);

module.exports = router;
