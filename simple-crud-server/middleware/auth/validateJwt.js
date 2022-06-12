const { searchByID } = require('../../database/repository/user/find')
const {base64decode} = require('../../helpers/utility')
const { getStatusModel } = require('../../models/statusModel')
const { getUserModel } = require('../../models/userModel')
async function validateJwt(db,request){
    let bearerToken = request.headers.authorization
    if(typeof bearerToken !== 'undefined'){
        const token = bearerToken.split(' ')[1].split('.')
        if(await validatePayload(db,token)) return Promise.resolve(true)
        else return Promise.resolve(false)
    }
    else{
        return Promise.resolve(false)
    }
}
async function validatePayload(db,token){
    const jwtPayload = JSON.parse(base64decode(token[1]))
    const userData = {
        id : jwtPayload.id
    }
    const newUserModel = getUserModel(userData)
    const newStatusModel = getStatusModel({})
    let newModel = {
        status : newStatusModel,
        user   : newUserModel
    }
    const returnedUserModel = await searchByID(db,JSON.stringify(newModel))
    if(!returnedUserModel.status.success)return Promise.resolve(false)
    if(returnedUserModel.user.name !== jwtPayload.name)return Promise.resolve(false)
    if(returnedUserModel.user.email !== jwtPayload.email)return Promise.resolve(false)
    if(returnedUserModel.user.username !== jwtPayload.username)return Promise.resolve(false)
    if(returnedUserModel.user.phone !== jwtPayload.phone)return Promise.resolve(false)
    return Promise.resolve(true)
}
module.exports = {
    validateJwt,
    validatePayload
}