const { create } = require("../database/repository/user/create")
const { verify } = require("../database/repository/user/verify")
// mongo functions import
const MongoCreateUser = require("../database/mongo-repository/user/create")
const MongoVerifyUser = require("../database/mongo-repository/user/verify")

const { hash } = require("../helpers/utility")
const { getStatusModel } = require("./statusModel")

const userModel = {
    id    : Number,
    name  : String,
    email : String
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

const registrationredentials = {
    name       : String,
    email      : String,
    password   : String
}
const loginCredentials = {
    email      : String,
    password   : String
}

function getUserModel(paramObj){
    let newUserModel = Object.create(userModel)
    newUserModel = {
        id    : typeof paramObj.id !== 'undefined' ? paramObj.id : null,
        name  : typeof paramObj.name !== 'undefined' ? paramObj.name : null,
        email : typeof paramObj.email !== 'undefined' ? paramObj.email : null
    }
    return newUserModel
}

async function getRegistrationCredentials(paramObj){
    let newCredentials = Object.create(registrationredentials)
    newCredentials = {
        name     : typeof paramObj.name !== 'undefined' ? paramObj.name : null,
        email    : typeof paramObj.email !== 'undefined' ? paramObj.email : null,
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
    // const newUser = await create(db,newCredentials,JSON.stringify(newCreateUserModel))
    const newUser = await MongoCreateUser.create(db,newCredentials,JSON.stringify(newCreateUserModel))
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
    //const user = await verify(db,newCredentials,JSON.stringify(newVerifyUserModel))
    const user = await MongoVerifyUser.verify(db,newCredentials,JSON.stringify(newVerifyUserModel))
    return user
}

module.exports = {
    getUserModel,
    createUser,
    verifyUser
}