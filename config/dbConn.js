/*
->index
*/
const mCon=require("mongoose").connect

const connectDB=async()=>{
    try{
        await mCon(process.env.DATABASE_URI)
    }catch(e){
        console.log(e)
    }
}

module.exports=connectDB