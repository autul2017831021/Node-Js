const { isEmptyObject } = require("../../../helpers/utility")
const mysql = require('mysql')

function findById(db,id,model){
    model = JSON.parse(model)
    id = parseInt(id)
    return new Promise(function(resolve,reject){
        const sql = 'SELECT posts.*,users.name AS name,users.email AS email,users.username AS username,users.phone AS phone FROM posts INNER JOIN users ON posts.user_id=users.id Where posts.id='+mysql.escape(id)
        db.query(sql,function(err, result, fields){
            if (err)
                reject(new Error("Error in find-post-by-postId DB query"))
            else{
                if(!isEmptyObject(result)){
                    model.status.success = true
                    model.status.code = 200
                    model.status.message = "Successfully Retrieved Post"
                }
                else{
                    model.status.message = "Post Does Not Exist"
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