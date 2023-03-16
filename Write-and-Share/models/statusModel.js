
const statusModel = {
    success : Boolean,
    code    : Number,
    message : String
}

function getStatusModel(param){
    let newStatusModel = Object.create(statusModel)
    newStatusModel = {
        success : typeof param.success !=='undefined' ? param.success : false,
        code    : typeof param.code !=='undefined' ? param.code : 400,
        message : typeof param.message !=='undefined' ? param.message : "Bad Request"
    }
    return newStatusModel
}

module.exports = {
    getStatusModel
}