const { getApiReqResTime } = require("../api-request-response-time/apiReqResTime")
const { commonResponse } = require("../helpers/utility")
const { getStatusModel } = require("../models/statusModel")

const errorResObj = {
    status : Object
}

function forbidden(request,response){
    const newStatusModel = getStatusModel({
        "code" : 403,
        "message" : "You Can Not Perform This Action"
    })
    let newErrorResObj = Object.create(errorResObj)
    newErrorResObj = {
        status : newStatusModel
    }
    commonResponse(response,newErrorResObj,'application/json')
}

function notFound(request,response){
    const newStatusModel = getStatusModel({
        "code" : 404,
        "message" : "Page Not Found"
    })
    let newErrorResObj = Object.create(errorResObj)
    newErrorResObj = {
        status : newStatusModel
    }
    commonResponse(response,newErrorResObj,'application/json')
}
function invalidToken(request,response){
    const newStatusModel = getStatusModel({
        "code" : 401,
        "message" : "Invalid Token"
    })
    let newErrorResObj = Object.create(errorResObj)
    newErrorResObj = {
        status : newStatusModel
    }
    commonResponse(response,newErrorResObj,'application/json')
}

module.exports = {
    forbidden,
    notFound,
    invalidToken
}