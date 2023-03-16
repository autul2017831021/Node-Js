const { getPostData, commonResponse } = require('../helpers/utility')
const { getProfile,updateProfile } = require("../models/userModel.js")
const { hash } = require("../helpers/utility")

async function getUserProfile(request,response,db,username){
    const userData = {
        id      : typeof id !== 'undefined' ? id : null,
        name    : typeof name !== 'undefined' ? name : null,
        email   : typeof email !== 'undefined' ? email : null,
        username: typeof username !== 'undefined' ? username : null,
        phone   : typeof phone !== 'undefined' ? phone : null
    }
    var userProfile = await getProfile(db,userData)
    commonResponse(response,userProfile,'application/json')
}

async function updateUserProfile(request,response,db,userInfo,jwt){
    const postData = JSON.parse(await getPostData(request))
    const updateData = {
        name            : typeof postData.name !== 'undefined' ? postData.name : null,
        email           : typeof postData.email !== 'undefined' ? postData.email : null,
        username        : typeof postData.username !== 'undefined' ? postData.username : null,
        currentPassword : typeof postData.currentPassword !== 'undefined' ? postData.currentPassword : null,
        newPassword     : typeof postData.newPassword !== 'undefined' ? (postData.newPassword !== null ? await hash(postData.newPassword) : null) : null,
        phone           : typeof postData.phone !== 'undefined' ? postData.phone : null
    }
    const updatedUser = await updateProfile(db,userInfo,updateData,jwt)
    commonResponse(response,updatedUser,'application/json')
}

module.exports = {
    getUserProfile,
    updateUserProfile
}