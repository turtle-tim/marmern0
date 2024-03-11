/*
-> index
*/
const router=require("express").Router()
const noteCon=require("../controller/noteCon")
const verifyJWT=require("../middleware/verifyJWT")

router.use(verifyJWT)
router.route('/')
    .get(noteCon.getAllNotes)
    .post(noteCon.createNewNote)
    .patch(noteCon.updateNote)
    .delete(noteCon.deleteNote)

module.exports=router