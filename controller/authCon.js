/*
ACCESS_, REFRESH_TOKEN_SECRET<- .env<- require("crypto").randomBytes(64).toString("hex") @node
-> authRoute
*/
const User=require("../model/user")
const bcrypt=require("bcrypt")
const asyncHandler=require("express-async-handler")
const jwtSign=require("jsonwebtoken").sign
const jwtVer=require("jsonwebtoken").verify

const login=asyncHandler(async(req,res)=>{
    const{username,password}=req.body
    if(!username||!password)return res.status(400).json({message:"You need to fill up the form"})
    const foundUser=await User.findOne({username}).exec()
    if(!foundUser||!foundUser.active)return res.status(401).json({message:"Unauthorized"})
    if(!await bcrypt.compare(password,foundUser.password))return res.status(401).json({message:"Unauthorized"})

    const accessToken=jwtSign(
        {"UserInfo":{"username":foundUser.username,"roles":foundUser.roles}},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    )
    const refreshToken=jwtSign(
        {"username":foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"7d"}
    )
    res.cookie("jwt",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"None",//cross-site cookie
        maxAge:7*24*60*60*1000
    })
    res.json({accessToken})
})

const refresh=(req,res)=>{
    const cookies=req.cookies
    if(!cookies?.jwt)return res.status(401).json({message:"Unauthorized"})
    jwtVer(cookies.jwt,process.env.REFRESH_TOKEN_SECRET,
        async(err,decoded)=>{
            if(err)return res.status(403).json({message:"Forbidden"})
            if(!await User.findOne({username:decoded.username}).exec())return res.status(401).json({message:"Unauthorized"})
            const accessToken=jwtSign(
        )
            res.json({accessToken})
        }
    )
}

const logout=(req,res)=>{
    const cookies=req.cookies
    if(!cookies?.jwt)return res.sendStatus(204)
    res.clearCookies("jwt",{httpOnly:true,sameSite:"None",secure:true})
    res.json({message:"Cookie cleared"})
}

module.exports={login,logout,refresh}