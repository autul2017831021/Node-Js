const {setJwtHeader,setJwtPayload} = require('./setJwtProperty.js')

function getJwtHeader(alg,typ){
    header = setJwtHeader(alg,typ)
    return header
}

function getJwtPayload(id,name,email,username,phone,isAdmin){
    payload = setJwtPayload(id,name,email,username,phone,isAdmin)
    return payload
}

module.exports = {
    getJwtHeader,
    getJwtPayload
}