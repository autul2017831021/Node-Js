const crypto = require('crypto')
const { createJwtSignature } = require('../../helpers/jwt/createJwt')

function verifyJwt(request){
    return true
    let bearerToken = request.headers.authorization
    if(typeof bearerToken !== 'undefined'){
        const token = bearerToken.split(' ')[1].split('.')
        
        if(verifySignature(token)) return true
        else return false
    }
    else{
        return false
    }
}

function verifySignature(token){
    const jwtHeader = token[0]
    const jwtPayload = token[1]
    const jwtSignature = token[2]

    const newJwtSignature = createJwtSignature(jwtHeader,jwtPayload)
    const isVerified = jwtSignature === newJwtSignature ? true : false
    return isVerified
}

module.exports = {
    verifyJwt
}