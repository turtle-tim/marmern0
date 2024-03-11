/*
-> index
*/
const router=require("express").Router()
const authCon=require("../controller/authCon")//import the whole list
const loginLimiter=require("../middleware/loginLimiter")

router.route("/").post(loginLimiter,authCon.login)//item in list
router.route("/logout").post(authCon.logout)
router.route("/refresh").get(authCon.refresh)

module.exports=router