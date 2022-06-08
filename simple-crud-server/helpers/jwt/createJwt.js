const { base64encode,replaceSpecialChars } = require("../utility")
const crypto = require('crypto')

function createJwt(header,payload){
    const jwtHeader = createJwtHeader(header)
    const jwtPayload = createJwtPayload(payload)
    const jwtSignature = createJwtSignature(jwtHeader,jwtPayload)
    const jwt = jwtHeader+"."+jwtPayload+"."+jwtSignature
    return jwt
}

function createJwtHeader(header){
    const jwtHeader = base64encode(convertToString(header))
    return replaceSpecialChars(jwtHeader)
}

function createJwtPayload(payload){
    const jwtPayload = base64encode(convertToString(payload))
    return replaceSpecialChars(jwtPayload)
}

function createJwtSignature(jwtHeader,jwtPayload){
    const jwtSignature = crypto.createHmac('sha256', 'sungodnika').update(jwtHeader+'.'+jwtPayload).digest('base64');
    return replaceSpecialChars(jwtSignature)
}

function convertToString(param){
    if(typeof param === 'object') param = JSON.stringify(param)
    return param
}

module.exports = {
    createJwtHeader,
    createJwtPayload,
    createJwtSignature,
    createJwt
}