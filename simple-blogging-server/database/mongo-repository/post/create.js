function create(db, data, model){
    model = JSON.parse(model)
    data.created_at = new Date()
    data.updated_at = new Date()
    return new Promise(function(resolve,reject){
        const collectionName = "posts_test"
        const databaseName = "testing"
        const dbo = db.db(databaseName)
        dbo.collection(collectionName).insertOne(data,function(err,result){
            if (err)
                reject(new Error("Error in DB query"))
            else{
                model.status.success = true
                model.status.code = 201
                model.status.message = "Post Created"
                model.post.id = result.insertedId
                model.post.title = data.title
                model.post.body = data.body
                resolve(model)
            }
        });
    })
}

module.exports = {
    create
}