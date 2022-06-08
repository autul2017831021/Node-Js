const mysql = require('mysql')

async function update(db,data,model,id){
    model = JSON.parse(model)
    return new Promise((resolve,reject)=>{
        let sqlData = {}
        if(data.title !== null)sqlData.title = data.title
        if(data.body !== null)sqlData.body = data.body
        if(data.updatedAt !== null)sqlData.updated_at = data.updatedAt
        const sql = 'UPDATE posts SET ? WHERE id='+mysql.escape(id)
        db.query(sql,sqlData,function(error, result, fields){
            model.status.message = "Post Updated Successfully"
            if(typeof sqlData.title !== 'undefined')model.posts[0].title = sqlData.title
            if(typeof sqlData.body !== 'undefined')model.posts[0].body = sqlData.body
            resolve(model)
        })
    })
}

module.exports = {
    update
}