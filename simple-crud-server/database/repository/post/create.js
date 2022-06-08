function create(db, data, model){
    model = JSON.parse(model)
    return new Promise(function(resolve,reject){
        const sql = "INSERT INTO posts(title,body,user_id) VALUES (?,?,?)"
        const values = [data.title,data.body,data.userId]
        db.query(sql,values,function(err, result, fields){
            if (err)
                reject(new Error("Error in DB query"))
            else{
                model.status.success = true
                model.status.code = 201
                model.status.message = "Post Created"
                model.post.id = result.insertId
                model.post.title = data.title
                model.post.body = data.body
                resolve(model)
            }     
        })
    })
}

module.exports = {
    create
}