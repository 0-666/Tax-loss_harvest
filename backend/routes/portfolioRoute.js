const express = require("express");
const { getPortfolio, addPosition, updatePositionLock } = require("../controller/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getPortfolio);
router.post("/", addPosition);
router.patch("/:ticker/lock", updatePositionLock);

module.exports = router;
