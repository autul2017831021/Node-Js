const mysql = require('mysql')

async function remove(db,model,id){
    model = JSON.parse(model)
    return new Promise((resolve,reject)=>{
        const sql = 'DELETE FROM posts WHERE id='+mysql.escape(id)
        db.query(sql,function(error, result, fields){
            if (error)
                reject(new Error("Error in delete-blog DB query"))
            else{
                model.status.success = true
                model.status.code = 200
                model.status.message = "Successfully Deleted Post"
                resolve(model)
            }
        })
    })
}
module.exports = {
    remove
}