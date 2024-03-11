/*
-> errorHandler, loginLimiter
-> index
*/
const{format}=require("date-fns")
const{v4:uuid}=require("uuid")
const path=require("path")
const fsExists=require("fs").existsSync
const fsPromises=require("fs").promises

const logEvents=async(msg,logFN)=>{
    const dateTime=format(new Date(),"yyyyMMdd\tHH:mm:sss")
    const logItem=`${dateTime}\t${uuid()}\t${msg}\n`
    const foldDir=path.join(__dirname,"..","logs")
    try{
        if(!fsExists(foldDir)){
            await fsPromises.mkdir(foldDir)
        }
        await fsPromises.appendFile(path.join(foldDir,logFN),logItem)
    }catch(e){
        console.log(e)
    }
}

const logger=(req,_,next)=>{
    const temp=`${req.method}\t${req.url}\t${req.header.origin}`
    logEvents(temp,"reqLog.log")
    console.log(temp)
    next()
}

module.exports={logEvents,logger}