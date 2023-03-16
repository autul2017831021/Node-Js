const { isEmptyObject } = require("../../../helpers/utility")
const mysql = require('mysql')
function findProfile(db,model){
    model = JSON.parse(model)
    var id = model.user.id
    id = parseInt(id)
    return new Promise(function(resolve,reject){
        const sql = 'SELECT * FROM posts WHERE user_id='+mysql.escape(id)+' ORDER BY updated_at DESC'
        db.query(sql,function(err, result, fields){
            if (err)
                reject(new Error("Error in findProfile DB query"))
            else{
                if(!isEmptyObject(result)){
                    model.status.message = "Successfully Found User Profile"
                }
                else{
                    model.status.message = "User Haven't Posted Yet" 
                }
                model.status.success = true
                model.status.code = 200
                model.posts = result
                resolve(model)
            }    
        })
    })
}
module.exports = {
    findProfile
}