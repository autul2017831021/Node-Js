async function checkUniqueEmail(db,data){
    const sql = 'SELECT * FROM `users` WHERE `email` = ?'
    email = data.email
    const paramObject = {
        isUniqueEmail : true
    }
    var isUniqueEmail = await validate(db,sql,email,paramObject,"isUniqueEmail",false)
    return new Promise((resolve,reject)=>{
        if(typeof isUniqueEmail === 'undefined'){
            reject(new Error("Error In Function : checkUniqueEmail() "))
        }
        else{
            resolve(isUniqueEmail)
        }
    })
}

async function checkValidEmail(db,data){
    const sql = 'SELECT * FROM `users` WHERE `email` = ?'
    email = data.email
    const paramObject = {
        hasEmail : false
    }
    var hasEmail = await validate(db,sql,email,paramObject,"hasEmail",true)
    return new Promise((resolve,reject)=>{
        if(typeof hasEmail === 'undefined'){
            reject(new Error("Error In Function : checkValidEmail() "))
        }
        else{
            resolve(hasEmail)
        }
    })
}

function validate(db, sql, values, paramObject, field, ifValid){
    return new Promise(function(resolve,reject){ 
        db.query(sql,values,function(err, result, fields){
            if (err)
                reject(err)
            else{
                if(result.length > 0){
                    paramObject[field] = ifValid
                    resolve(paramObject)
                }
                else{
                    resolve(paramObject)
                }
            }    
        })
    })
}

module.exports = {
    checkUniqueEmail,
    checkValidEmail,
    validate
}