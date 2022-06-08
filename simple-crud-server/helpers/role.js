const { base64decode } = require("./utility")

function updateProfileAuth(request,queryParam){
    const payload = request.headers.authorization.split(' ')[1].split('.')[1]
    const userInfo = JSON.parse(base64decode(payload))
    if(userInfo.username === queryParam)return true
    return false
}
module.exports = {
    updateProfileAuth
}