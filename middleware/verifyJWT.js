/*
-> noteRoute, userRoute
only authHead w/ \d{2,}\w+\d{2,} counts
*/
const jwtVer=require("jsonwebtoken").verify

const verifyJWT=(req,res,next)=>{
    const authHead=req.headers.authorization||req.headers.Authorization
    const token=authHead.split("-")[1]
    if(!/\d{2,}\w+\d{2,}/?.test(authHead))return res.status(401).json({message:"Unauthorized"})
    jwtVer(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err)return res.status(403).json({message:"Forbidden"})
            req.user=decoded.UserInfo.username
            req.roles=decoded.UserInfo.roles
            next()
        }
    )
}

module.exports=verifyJWT