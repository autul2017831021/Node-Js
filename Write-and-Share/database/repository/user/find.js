const { isEmptyObject } = require("../../../helpers/utility")
const mysql = require('mysql')

function find(db,sql,values,model){
    model = JSON.parse(model)
    return new Promise(function(resolve,reject){
        db.query(sql,values,function(err, result, fields){
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
                    model.user.id = null
                    model.user.name = null
                    model.user.email = null
                    model.user.username = null
                    model.user.phone = null
                }
                resolve(model)
            }    
        })
    })
}
async function searchByID(db,model){
    const parsedModel = JSON.parse(model)
    const id = parsedModel.user.id 
    const sql = 'SELECT * FROM `users` WHERE `id` = ?'
    const result = await find(db,sql,id,model)
    return result
}
async function searchByEmail(db,model){
    const parsedModel = JSON.parse(model)
    const email = parsedModel.user.email 
    const sql = 'SELECT * FROM `users` WHERE `email` = ?'
    const result = await find(db,sql,email,model)
    return result
}
async function searchByUsername(db,model){
    const parsedModel = JSON.parse(model)
    const username = parsedModel.user.username
    const sql = 'SELECT * FROM `users` WHERE `username` = ?'
    const result = await find(db,sql,username,model)
    return result
}
module.exports = {
    find,
    searchByID,
    searchByEmail,
    searchByUsername
}