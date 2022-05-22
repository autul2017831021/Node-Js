const { checkUniqueEmail } = require('../validator.js')

async function create(db, credentials, model){
    model = JSON.parse(model)
    const collectionName = "users"
    const databaseName = "testing"
    const dbo = db.db(databaseName)
    var validityCheck = await checkUniqueEmail(dbo,collectionName,credentials)
    return new Promise(function(resolve,reject){
        if(validityCheck.isUniqueEmail){
            dbo.collection(collectionName).insertOne(credentials,function(err,result){
                try {
                    model.status.success = true
                    model.status.code = 201
                    model.status.message = "User Created Successfully"
                    model.user.id = result.insertId
                    model.user.name = credentials.name
                    model.user.email = credentials.email
                    model.password = credentials.password
                    resolve(model) 
                } catch (error) {
                    reject(error)
                }
            })
        }
        else{
            model.status.message = "Registration Failed. An User Already Exists With This Email( "+credentials.email+" ). Please Choose Another Email"
            resolve(model)
        }  
    })
}

module.exports = {
    create
}