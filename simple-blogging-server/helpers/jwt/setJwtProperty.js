function setJwtHeader(alg,typ){
    let header = {
        alg,
        typ
    }
    return header
}

function setJwtPayload(id,name,email,isAdmin){
    let payload = {
        id,
        name,
        email,
        isAdmin
    }
    return payload
}

module.exports = {
    setJwtHeader,
    setJwtPayload
}