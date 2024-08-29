const { Router } = require("express");
const authController = require("../../Controller/authController/authController") 

const router = Router();

router.post("/signup", authController.addUser)
router.post("/login", authController.loginUser)

module.exports = router;