/*
-> noteRoutes
CRUD note
*/
const User=require("../model/user")
const Note=require("../model/note")
const asyncHandler=require("express-async-handler")

const getAllNotes=asyncHandler(async(_,res)=>{
    const notes=await Note.find().lean()
    if(!notes?.length)return res.status(400).json({message:"No Notes found"})
    const notesWithUser=await Promise.all(notes.map(async(note)=>{
    const user=await User.findById(note.user).lean().exec()
    return{...note,username:user.username}
    }))
    res.json(notesWithUser)
})//getAllNotes

const createNewNote=asyncHandler(async(req,res)=>{
    const{user,title,text}=req.body
    if(!user||!title||!text)return res.status(400).json({message:"You need to fill up the form"})
    if(await Note.findOne({title}).collation({locate:"en",strength:2}).lean().exec())return res.status(409).json({message:"Duplicated title"})
    if(await Note.create({user,title,text}))return res.status(201).json({message:`New note "${title}" created`})
    else return res.status(400).json({message:"Invalid note data"})
})//createNewNote

const updateNote=asyncHandler(async(req,res)=>{
    const{id,user,title,text,completed}=req.body
    if(!id||!user||!title||!text||!completed)return res.status(400).json({message:"You need to fill up the form"})
    const note=await Note.findById(id).exec()
    if(!note)return res.status(400).json({message:"No notes found"})
    const duplicate=await Note.findOne({title}).collation({locate:"en",strength:2}).lean().exec()
    if(duplicate&&duplicate?._id.toString()!==id)return res.status(409).json({message:"Duplicated title"})

    note.user=user
    note.title=title
    note.text=text
    note.completed=completed
    res.json(`"${(await note.save()).title}" updated`)
})//updateNote

const deleteNote=asyncHandler(async(req,res)=>{
    const{id}=req.body
    if(!id)return res.status(400).json({message:"You need to put in an ID"})
    const note=await Note.findById(id).exec()
    if(!note)return res.status(400).json({message:"No notes found"})
    const result=await note.deleteOne()
    res.json(`Deleted note "${result.title}" whose ID was ${result._id}`)
})//deleteNote

module.exports={getAllNotes,createNewNote,updateNote,deleteNote}