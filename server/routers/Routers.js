const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");

router.post("/login", Controller.login);
router.post("/register", Controller.register);

router.get("/tools", Controller.getTool);
router.get("/tool/:id", Controller.getToolDetail);

router.get("/vps", Controller.getVPS);
router.get("/vps/:id", Controller.getVPSDetail);

router.get("/users/:userID/usd", Controller.getUSD);

router.post("/purchase", Controller.purchase);

router.get("/discount", Controller.getDiscount);

module.exports = router;
