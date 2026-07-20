const express = require("express");
const router = express.Router();

const masterController = require("../controllers/masterController");

// GET /api/master?type=cities
router.get("/", masterController.getMasterData);

module.exports = router;