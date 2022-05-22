const { checkValidEmail } = require('../validator.js')
const { createJwt } = require('../../../helpers/jwt/createJwt.js')
const { getJwtHeader,getJwtPayload } = require('../../../helpers/jwt/getJwtProperty.js')
var bcrypt = require('bcrypt')

async function verify(db, credentials, model){
    model = JSON.parse(model)
    const collectionName = "users"
    const databaseName = "testing"
    const dbo = db.db(databaseName)
    var validityCheck = await checkValidEmail(dbo,collectionName,credentials)
    return new Promise(function(resolve,reject){
        if(validityCheck.hasEmail){
            dbo.collection(collectionName).find({email:credentials.email}).toArray(async function(err,result){
                try {
                    var hashedPassword = result[0].password
                    const isValid = await bcrypt.compare(credentials.password,hashedPassword)
                    if(isValid){
                        model.status.success = true
                        model.status.code = 200
                        model.status.message = "Login Successful"
                        model.user.id = result[0]._id
                        model.user.name = result[0].name
                        model.user.email = result[0].email
                        model.token = createJwt(getJwtHeader("HS256","JWT"),getJwtPayload(result[0]._id,result[0].name,result[0].email,result[0].email === "admin@gmail.com" ? true : false))
                        resolve(model)
                    }
                    else{
                        model.status.code = 401
                        model.status.message = "Invalid Password"
                        resolve(model)
                    }
                } catch (error) {
                    reject(error)
                }
            })
        }
        else{
            model.status.code = 401
            model.status.message = "Invalid Email"
            resolve(model)
        }  
    }) 
}

module.exports = {
    verify
}