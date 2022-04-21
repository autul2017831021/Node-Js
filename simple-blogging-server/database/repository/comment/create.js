const { findById } = require("../post/findById")

function create(db, data, model){
    return new Promise(async function(resolve,reject){
        const postById = await findById(db,data.postId,model)
        model = JSON.parse(model)
        //console.log(postById,'\n',model)
        if(postById.status.success && !postById.posts[0].is_assigned){
            const sql = "INSERT INTO comments(body,post_id,user_id) VALUES (?,?,?)"
            const values = [data.body,data.postId,data.userId]
            db.query(sql,values,function(err, result, fields){
                if (err){
                    reject(new Error("Error in DB query"))
                }
                else{
                    model.status.success = true
                    model.status.code = 201
                    model.status.message = "Comment Created Successfull"
                    model.id = result.insertId
                    model.body = data.body
                    model.post.id = postById.posts[0].id
                    model.post.title = postById.posts[0].title
                    model.post.body = postById.posts[0].body
                    resolve(model) 
                }     
            })
        }
        else if(postById.status.success && postById.posts[0].is_assigned){
            model.status.success = true
            model.status.code = 200
            model.status.message = "This Post Does Not Allow Any New Comment"
            model.post.id = postById.posts[0].id
            model.post.title = postById.posts[0].title
            model.post.body = postById.posts[0].body
            resolve(model)
        }
        else{
            model.status.message = "Post Does Not Exist"
            resolve(model)
        }
    })
}

module.exports = {
    create
}