function setJwtHeader(alg,typ){
    let header = {
        alg,
        typ
    }
    return header
}

function setJwtPayload(id,name,email,username,phone,isAdmin){
    let payload = {
        id,
        name,
        email,
        username,
        phone,
        isAdmin
    }
    return payload
}

module.exports = {
    setJwtHeader,
    setJwtPayload
}