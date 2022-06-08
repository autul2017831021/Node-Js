const { isEmptyObject } = require("../../../helpers/utility")
const mysql = require('mysql')

function find(db,model){
    model = JSON.parse(model)
    return new Promise(function(resolve,reject){
        const sql = searchByUsername(model.user.username)
        db.query(sql,function(err, result, fields){
            if (err)
                reject(new Error("Error in find-user DB query"))
            else{
                if(!isEmptyObject(result)){
                    model.status.success = true
                    model.status.code = 200
                    model.status.message = "Successfully Found User"
                    model.user.id = result[0].id
                    model.user.name = result[0].name
                    model.user.email = result[0].email
                    model.user.username = result[0].username
                    model.user.phone = result[0].phone
                }
                else{
                    model.status.message = "User Does Not Exist"
                    model.user.username = null
                }
                resolve(model)
            }    
        })
    })
}
function searchByID(id){
    return 'SELECT * FROM users WHERE users='+mysql.escape(id)
}
function searchByEmail(email){
    return 'SELECT * FROM users WHERE users='+mysql.escape(email)
}
function searchByUsername(username){
    return 'SELECT * FROM users WHERE username='+mysql.escape(username)
}
module.exports = {
    find
}