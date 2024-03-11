/*
-> index
*/
const router=require("express").Router()
const path=require("path")

router.get("^/$|/index(.html)?",(_,res)=>res.sendFile(path.join(__dirname,"..","views","index.html")))
module.exports=router
