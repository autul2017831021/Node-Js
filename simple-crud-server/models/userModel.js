const { create } = require("../database/repository/user/create")
const { find } = require("../database/repository/user/find")
const { findProfile } = require("../database/repository/user/findProfile")
const { update } = require("../database/repository/user/update")
const { verify } = require("../database/repository/user/verify")

const { hash } = require("../helpers/utility")
const { getStatusModel } = require("./statusModel")

const userModel = {
    id       : Number,
    name     : String,
    email    : String,
    username : String,
    phone    : String
}

const createUserModel = {
    status   : Object,
    user     : Object,
    password : String
}

const verifyUserModel = {
    status : Object,
    user   : Object,
    token  : String
}

const userProfileModel = {
    status    : Object,
    user      : Object,
    posts     : Array,
    lastPosted: Date,
    totalPosts: Number
}

const registrationredentials = {
    name       : String,
    email      : String,
    username   : String,
    password   : String
}
const loginCredentials = {
    email      : String,
    password   : String
}

function getUserModel(paramObj){
    let newUserModel = Object.create(userModel)
    newUserModel = {
        id       : typeof paramObj.id !== 'undefined' ? parseInt(paramObj.id) : null,
        name     : typeof paramObj.name !== 'undefined' ? paramObj.name : null,
        email    : typeof paramObj.email !== 'undefined' ? paramObj.email : null,
        username : typeof paramObj.username !== 'undefined' ? paramObj.username : null,
        phone    : typeof paramObj.phone !== 'undefined' ? paramObj.phone : null
    }
    return newUserModel
}

async function getRegistrationCredentials(paramObj){
    let newCredentials = Object.create(registrationredentials)
    newCredentials = {
        name     : typeof paramObj.name !== 'undefined' ? paramObj.name : null,
        email    : typeof paramObj.email !== 'undefined' ? paramObj.email : null,
        username : typeof paramObj.username !== 'undefined' ? paramObj.username : null,
        password : typeof paramObj.password !== 'undefined' ? await hash(paramObj.password) : null
    }
    return newCredentials
}
function getLoginCredentials(paramObj){
    let newCredentials = Object.create(loginCredentials)
    newCredentials = {
        email    : typeof paramObj.email !== 'undefined' ? paramObj.email : null,
        password : typeof paramObj.password !== 'undefined' ? paramObj.password : null
    }
    return newCredentials
}

async function createUser(db,data){
    let newCredentials = await getRegistrationCredentials(data)
    const newUserModel = getUserModel({})
    const newStatusModel = getStatusModel({})

    let newCreateUserModel = Object.create(createUserModel)
    newCreateUserModel = {
        status   : newStatusModel,
        user     : newUserModel,
        password : null
    }
    const newUser = await create(db,newCredentials,JSON.stringify(newCreateUserModel))
    return newUser
}

async function verifyUser(db,data){
    const newCredentials = getLoginCredentials(data)
    const newUserModel = getUserModel({})
    const newStatusModel = getStatusModel({})

    let newVerifyUserModel = Object.create(verifyUserModel)
    newVerifyUserModel = {
        status : newStatusModel,
        user   : newUserModel,
        token  : null
    }
    const user = await verify(db,newCredentials,JSON.stringify(newVerifyUserModel))
    return user
}
async function getProfile(db,userData){
    const newUserModel = getUserModel(userData)
    const newStatusModel = getStatusModel({})
    let newUserProfileModel = Object.create(userProfileModel)
    newUserProfileModel = {
        status      : newStatusModel,
        user        : newUserModel,
        posts       : [],
        lastPosted  : null,
        totalPosts  : 0
    }
    const userExists = await find(db,JSON.stringify(newUserProfileModel))
    if(!userExists.status.success)return userExists
    newUserProfileModel.user.id         = userExists.user.id
    newUserProfileModel.user.name       = userExists.user.name
    newUserProfileModel.user.email      = userExists.user.email
    newUserProfileModel.user.username   = userExists.user.username
    newUserProfileModel.user.phone      = userExists.user.phone
    const userProfile = await findProfile(db,JSON.stringify(newUserProfileModel))
    return userProfile
}
async function updateProfile(db,userInfo,updateDate,jwt){
    const newUserModel = getUserModel(userInfo)
    const newStatusModel = getStatusModel({})
    let updatedUserProfileModel = Object.create(userProfileModel)
    updatedUserProfileModel = {
        status      : newStatusModel,
        user        : newUserModel,
        token       : jwt
    }
    const updatedUser = await update(db,updateDate,JSON.stringify(updatedUserProfileModel))
    return updatedUser
}

module.exports = {
    getUserModel,
    createUser,
    verifyUser,
    getProfile,
    updateProfile
}