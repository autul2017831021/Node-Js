const { ObjectId } = require("mongodb")
const { isEmptyObject } = require("../../../helpers/utility")

function findById(db,id,model){
    model = JSON.parse(model)
    return new Promise(function(resolve,reject){
        const collectionName = "posts_test"
        const databaseName = "testing"
        const dbo = db.db(databaseName)
        if(!ObjectId.isValid(id)){
            model.status.success = true
            model.status.code = 404
            model.status.message = "Not Found"
            resolve(model)
        }
        dbo.collection(collectionName).find({_id:ObjectId(id)}).toArray(function(err,result){
            if (err)
                reject(new Error("Error in DB query"))
            else{
                if(!isEmptyObject(result)){
                    model.status.success = true
                    model.status.code = 200
                    model.status.message = "Successfully Retrieved The Post"
                }
                else{
                    model.status.success = true
                    model.status.code = 404
                    model.status.message = "Not Found"
                }
                model.posts = result
                resolve(model)
            }
        })
    })
}

module.exports = {
    findById
}