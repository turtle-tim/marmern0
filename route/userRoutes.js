/*
-> index
*/
const router=require("express").Router()
const userCon=require("../controller/userCon")
const verifyJWT=require("../middleware/verifyJWT")

router.use(verifyJWT)
router.route('/')
    .get(userCon.getAllUsers)
    .post(userCon.createNewUser)
    .patch(userCon.updateUser)
    .delete(userCon.deleteUser)

module.exports=router