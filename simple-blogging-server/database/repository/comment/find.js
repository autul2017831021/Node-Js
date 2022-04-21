const { findById } = require("../post/findById")

async function find(db,postId,model){
    return new Promise(async function(resolve,reject){
        const postById = await findById(db,postId,model)
        model = JSON.parse(model)
        if(postById.status.success && !postById.posts[0].is_assigned){
            model.post.id = postById.posts[0].id
            model.post.title = postById.posts[0].title
            model.post.body = postById.posts[0].body
            await findCommentsOnThisPost(db,postId,model)
            resolve(model)
        }
        else if(postById.status.success && postById.posts[0].is_assigned){
            model.status.success = true
            model.status.code = 200
            model.status.message = "The Comments Of This Post Have Been Disabled"
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

function findCommentsOnThisPost(db,postId,model){
    return new Promise(function(resolve,reject){
        const sql = 'SELECT comments.id,comments.body,JSON_OBJECT("id",users.id,"name",users.name,"email",users.email) AS user FROM comments INNER JOIN users ON comments.user_id=users.id Where comments.post_id='+postId
        db.query(sql,function(err, result, fields){
            if (err)
                reject(new Error("Error in DB query"))
            else{
                model.status.success = true
                model.status.code = 200
                model.status.message = "Successfully Retrieved All The Comments"
                model.comments = result
                resolve(model)
            }    
        })
    })
}

module.exports = {
    find
}