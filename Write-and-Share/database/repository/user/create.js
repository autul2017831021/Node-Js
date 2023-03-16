const { checkUniqueEmail, checkUniqueUsername } = require('../validator.js')

async function create(db, credentials, model){
    model = JSON.parse(model)
    var emailValidityCheck = await checkUniqueEmail(db,credentials)
    var usernameValidityCheck = await checkUniqueUsername(db,credentials)
    return new Promise(function(resolve,reject){
        if(emailValidityCheck.isUniqueEmail && usernameValidityCheck.isUniqueUsername){
            const sql = "INSERT INTO users SET ?"
            db.query(sql,credentials,function(error, result, fields){
                try {
                    model.status.success = true
                    model.status.code = 201
                    model.status.message = "User Created Successfully"
                    model.user.id = result.insertId
                    model.user.name = credentials.name
                    model.user.email = credentials.email
                    model.user.username = credentials.email
                    model.password = credentials.password
                    resolve(model) 
                } catch (error) {
                    reject(error)
                }
            })
        }
        else if(!emailValidityCheck.isUniqueEmail){
            model.status.message = "Registration Failed. An User Already Exists With This Email( "+credentials.email+" ). Please Choose Another Email"
            resolve(model)
        }
        else{
            model.status.message = "Registration Failed. An User Already Exists With This Username( "+credentials.username+" ). Please Choose Another Username"
            resolve(model)
        }
    })
}

module.exports = {
    create
}