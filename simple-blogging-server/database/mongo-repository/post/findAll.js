const { isEmptyObject } = require("../../../helpers/utility")

function findAll(db,model){
    model = JSON.parse(model)
    return new Promise(function(resolve,reject){
        const collectionName = "posts_test"
        const databaseName = "testing"
        const dbo = db.db(databaseName)
        dbo.collection(collectionName).find().toArray(function(err,result){
            if (err)
                reject(new Error("Error in DB query"))
            else{
                model.status.success = true
                model.status.code = 200
                if(!isEmptyObject(result)){
                    model.status.message = "Successfully Retrieved All Posts"
                }
                else{
                    model.status.message = "There Are No Available Posts TO Show"
                }
                model.posts = result
                resolve(model)
            }
        })
    })
}

module.exports = {
    findAll
}