const { response } = require("express");
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.send("Hello express");
});

module.exports = router;
