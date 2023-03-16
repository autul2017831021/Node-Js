const { getPostData, commonResponse } = require('../helpers/utility')
const { verifyUser, createUser } = require("../models/userModel.js")

async function register(request,response,db){
    const postData = await getPostData(request)    
    var newUser = await createUser(db,JSON.parse(postData))
    commonResponse(response,newUser,'application/json')
}

async function login(request,response,db){
    const postData = await getPostData(request)
    var user = await verifyUser(db,JSON.parse(postData))
    commonResponse(response,user,'application/json')
}

module.exports = {
    register,
    login
}