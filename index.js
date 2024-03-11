/*
note,user-> note, user, auth Con->note, user, auth Route-> index
                                                    root-> index
                        verifyJWT-> note, user Route
                logger->loginLimiter, errorHandler
                        loginLimiter-> auth Route
                                        errorHandler->index
                        dbConn, cors Opt-> index
                        allower Org-> cors Opt
*/
require("dotenv").config()
require("express-async-errors")

const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors") //inline comment
const mConnection=require("mongoose").connection

const app=express()
const path=require("path")
const PORT=process.env.PORT|| 3500

const{logger,logEvents}=require("./middleware/logger")
const errorHandler=require("./middleware/errorHandler")
const corsOptions=require("./config/corsOptions")
const connectDB=require("./config/dbConn")

console.log(process.env.NODE_ENV)
connectDB()
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use("/",express.static(path.join(__dirname,"public")))
app.use("/",require("./route/root"))
app.use("/auth",require("./route/authRoutes"))
app.use("/users",require("./route/userRoutes"))
app.use("/notes",require("./route/noteRoutes"))
app.all("*",
(req,res)=>{
    res.status(404)
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname,"views","404.html"))
    }else if(req.accepts("json")){
        res.json({message:"Page Not Found"})
    }else{
        res.type("txt").send("404 Hacker begone")
    }
}
)
app.use(errorHandler)

mConnection.once("open",
()=>{
    console.log("In Mongo")
    app.listen(PORT,
        ()=>console.log(`Server on port ${PORT}`)
        )
}
)
mConnection.on("error",
err=>{
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log")
    console.log(err)
}
)
