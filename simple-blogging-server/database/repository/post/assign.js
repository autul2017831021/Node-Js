const { findById } = require("./findById")

async function assign(db,data,model){
    return new Promise(async function(resolve,reject){
        const postById = await findById(db,data.postId,model)
        model = JSON.parse(model)
        if(postById.status.success){
            if(data.userId === postById.posts[0].user_id){
                const sql = "UPDATE posts SET is_assigned = ? WHERE id = ?"
                let values = [data.isAssigned,data.postId]
                db.query(sql,values,function(err, result, fields){
                    if (err){
                        reject(new Error("Error in DB query"))
                    }
                    else{
                        model.status.success = true
                        model.status.code = 200
                        model.status.message = data.isAssigned === true ?"Assigned" : "Not Assigned"
                        model.isAssigned = data.isAssigned
                        // model.assignee.id = data.userId
                        resolve(model) 
                    }     
                })
            }
            else{
                model.status.code = 403
                model.status.message = "You Are Not Authorized To Perform This Action"
                model.isAssigned = postById.posts[0].is_assigned
                resolve(model)
            }
        }
        else{
            model.status.message = "Post Does Not Exist"
            resolve(model)  
        }
    })
}


module.exports = {
    assign
}