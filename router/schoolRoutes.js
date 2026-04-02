const express = require("express");
const router = express.Router();
const {
  addSchool,
  listSchools
} = require("../Controllers/schoolController");

router.post("/addSchool", addSchool);
router.get("/listSchools", listSchools);

module.exports = router;