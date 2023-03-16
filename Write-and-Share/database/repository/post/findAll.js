const { isEmptyObject } = require("../../../helpers/utility")

function findAll(db,model){
    model = JSON.parse(model)
    return new Promise(function(resolve,reject){
        const sql = 'SELECT posts.*,users.name AS name,users.email AS email,users.username AS username,users.phone AS phone FROM posts INNER JOIN users ON posts.user_id=users.id ORDER BY updated_at DESC'
        db.query(sql,function(err, result, fields){
            if (err)
                reject(new Error("Error in find-all-blogs DB query"))
            else{
                if(!isEmptyObject(result)){
                    model.status.success = true
                    model.status.code = 200
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