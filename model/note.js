/*
-> noteCon, userCon
*/
const mongoose=require("mongoose")
const AutoIncrement=require("mongoose-sequence")(mongoose)

const noteSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    title:{
        type: String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:true
    }
})

noteSchema.plugin(AutoIncrement,{
    inc_field:"ticket",
    id:"tricketNums",
    start_seq:5000
})

module.exports=mongoose.model("Note",noteSchema)