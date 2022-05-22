async function checkUniqueEmail(dbo,collectionName,data,){
    email = data.email
    const paramObject = {
        isUniqueEmail : true
    }
    var isUniqueEmail = await validate(dbo,collectionName,email,paramObject,"isUniqueEmail",false)
    return new Promise((resolve,reject)=>{
        if(typeof isUniqueEmail === 'undefined'){
            reject(new Error("Error In Function : checkUniqueEmail() "))
        }
        else{
            resolve(isUniqueEmail)
        }
    })
}

async function checkValidEmail(dbo,collectionName,data){
    email = data.email
    const paramObject = {
        hasEmail : false
    }
    let hasEmail = await validate(dbo,collectionName,email,paramObject,"hasEmail",true)
    console.log(hasEmail)
    return new Promise((resolve,reject)=>{
        if(typeof hasEmail === 'undefined'){
            reject(new Error("Error In Function : checkValidEmail() "))
        }
        else{
            resolve(hasEmail)
        }
    })
}

function validate(dbo, collectionName, values, paramObject, field, ifValid){
    return new Promise(function(resolve,reject){ 
        dbo.collection(collectionName).find({email:values}).toArray(function(err,result){
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