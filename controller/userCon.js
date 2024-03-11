/*
-> UserRoutes
Note's id must match with User's id
CRUD User
*/
const User=require("../model/user")
const Note=require("../model/note")
const bcrypt=require("bcrypt")
const asyncHandler=require("express-async-handler")

const getAllUsers=asyncHandler(async(_,res)=>{
    const users=await User.find().select("-password").lean()
    if(!users?.length)return res.status(400).json({message:"No users found"})
    res.json(users)
})//getAllUsers

const createNewUser=asyncHandler(async(req,res)=>{
    const{username,password,roles}=req.body
    if(!username||!password||!roles)return res.status(400).json({message:"You need to fill up the form"})
    if(await User.findOne({username}).collation({locate:"en",strength:2}).lean().exec())return res.status(409).json({message:"Duplicated username"})
    /*
    collation({...,strength:2})=> case insensitive
    lean()=> drop all attributes except for the string coparison
    */
    const hashedPassword=await bcrypt.hash(password,12)
    const userObject=(!Array.isArray(roles)||!roles.length)//js's ifelse(): (conidtion)?<true then do1>:<false then do2>
        ?{username,"password":hashedPassword}
        :{username,"password":hashedPassword,roles}
    if(await User.create(userObject))return res.status(201).json({message:`New user "${username}" created`})
    else return res.status(400).json({message:"Invalid user data"})
})//createNewUser

const updateUser=asyncHandler(async(req,res)=>{
    const{id,username,roles,active,password}=req.body
    if(!id||!username||!Array.isArray(roles)||!roles.length||typeof active!=="boolean"||!password)
    return res.status(400).json({message:"You need to fill up the form properly"})
    const note=await Note.findById(id).exec()
    if(!note)return res.status(400).json({message:"No users found"})
    const duplicate=await User.findOne({username}).collation({locate:"en",strength:2}).lean().exec()
    if(duplicate&&duplicate?._id.toString()!==id)return res.status(409).json({message:"Duplicated username"})

    user.username=username
    user.roles=roles
    user.active=active
    user.password=await bcrypt.hash(password,12)
    res.json(`"${(await user.save()).username}" updated`)
})//updateUser

const deleteUser=asyncHandler(async(req,res)=>{
    const{id,username}=req.body
    if(!id)return res.status(400).json({message:"You need to put in an ID"})
    const user=await User.findById(id).exec()
    if(!user)return res.status(400).json({message:"No users found"})
    if(await Note.findOne({user:id}).lean().exec())
    return res.status(400).json({message:`User-${username}, still has some note(s). Chill the f out`})
    const result=await user.deleteOne()
    res.json(`Deleted user-${result.username}, whose ID was ${result._id}`)
})//deleteUser

module.exports={getAllUsers,createNewUser,updateUser,deleteUser}