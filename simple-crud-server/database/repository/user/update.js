const { checkUniqueEmail, checkUniqueUsername } = require('../validator.js')
const mysql = require('mysql')
var bcrypt = require('bcrypt')
const { getJwtHeader, getJwtPayload } = require('../../../helpers/jwt/getJwtProperty.js')
const { createJwt } = require('../../../helpers/jwt/createJwt.js')

async function update(db, data, model){
    model = JSON.parse(model)
    var newData = {
        name    :  null,
        email   :  null,
        username:  null,
        password:  null,
        phone   :  null
    }
    var validData = {
        name    : false,
        email   : false,
        username: false,
        password: false,
        phone   : false
    }
    return new Promise(async function(resolve,reject){
        await validateUpdateData(db,data,model,newData,validData)
        if(validData.name && validData.email && validData.username && validData.phone && validData.password){
            let sqlData = {}
            if(newData.name !== null)sqlData.name = newData.name
            if(newData.email !== null)sqlData.email = newData.email
            if(newData.username !== null)sqlData.username = newData.username
            if(newData.phone !== null)sqlData.phone = newData.phone
            if(newData.password !== null)sqlData.password = newData.password
            const sql = "UPDATE users SET ? WHERE id="+mysql.escape(model.user.id)
            db.query(sql,sqlData,function(error, result, fields){
                try {
                    model.status.success = true
                    model.status.code = 201
                    model.status.message = "User Updated Successfully"
                    model.user.name = newData.name !== null ? newData.name : model.user.name
                    model.user.email = newData.email !== null ? newData.email : model.user.email
                    model.user.username = newData.username !== null ? newData.username : model.user.username
                    model.user.phone = newData.phone !== null ? newData.phone : model.user.phone
                    model.token = createJwt(getJwtHeader("HS256","JWT"),getJwtPayload(model.user.id,model.user.name,model.user.email,model.user.username,model.user.phone,model.user.id === 1 ? true : false))
                    resolve(model) 
                } catch (error) {
                    reject(error)
                }
            })
        }
        else{
            resolve(model)
        }
    })
}
async function validateUpdateData(db,data,model,newData,validData){
    updateName(db,data,model,newData,validData)
    updatePhone(db,data,model,newData,validData)
    await updatePassword(db,data,model,newData,validData)
    await updateUsername(db,data,model,newData,validData)
    await updateEmail(db,data,model,newData,validData)
}
function updateName(db,data,model,newData,validData){
    if(data.name !== null)newData.name = data.name
    validData.name = true
}
function updatePhone(db,data,model,newData,validData){
    if(data.phone !== null)newData.phone = data.phone
    validData.phone = true
}

async function updateEmail(db,data,model,newData,validData){
    if(data.email !== null){
        var emailValidityCheck = await checkUniqueEmail(db,data)
        if(emailValidityCheck.isUniqueEmail){
            newData.email = data.email
            validData.email = true
        }
        else model.status.message = "Email Is Not Unique"
    }
    else validData.email = true
}
async function updateUsername(db,data,model,newData,validData){
    if(data.username !== null){
        var usernameValidityCheck = await checkUniqueUsername(db,data)
        if(usernameValidityCheck.isUniqueUsername){
            newData.username = data.username
            validData.username = true
        }
        else model.status.message = "Email Is Not Unique"
    }
    else validData.username = true
}
async function updatePassword(db,data,model,newData,validData){
    var isValid = false
    if(data.newPassword !== null && data.currentPassword !== null){
        var newObj = await checkPassword(db,data,model)
        isValid = newObj.isValid
    }
    if(isValid) {newData.password = data.newPassword;validData.password = true}
    else if(!isValid && data.newPassword !== null )model.status.message = "Please Enter The Correct Current Password"
    else validData.password = true
}
async function checkPassword(db,data,model){
    return new Promise(async function(resolve,reject){
        var paramObj = {
            isValid : false
        }
        db.query('SELECT * FROM `users` WHERE `id` = ?',model.user.id,async function(error,result,fields){
            var hashedPassword = result[0].password
            paramObj.isValid = await bcrypt.compare(data.currentPassword,hashedPassword)
            resolve(paramObj)
        })
    })
}
module.exports = {
    update,
    validateUpdateData,
    updateEmail,
    updateUsername,
    updatePassword,
    checkPassword,
    updateName,
    updatePhone
}