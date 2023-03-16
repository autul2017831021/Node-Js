const { getApiReqResTime } = require('./apiReqResTime.js')
const {StringDecoder} = require('string_decoder')
const crypto = require('crypto')
var bcrypt = require('bcrypt')


function commonResponse(response,model,contentType){
    let dateObj = new Date()
    //model = JSON.parse(model)
    response.statusCode = model.status.code
    response.writeHead(response.statusCode, {'Content-Type': contentType})
    response.end(JSON.stringify(model) )
    console.log('Response Time : ',getApiReqResTime(dateObj) )
    console.log('Response Code : ',response.statusCode)
    console.log(model)
}

function  isEmptyObject(object) {  
    return Object.keys(object).length === 0
  }

function getPostData(request){
    return new Promise((resolve, reject) => {
        try {
            let postData = ''
            const decoder = new StringDecoder('utf-8')
            request.on('data',function(buffer){
                postData += decoder.write(buffer)
            })
            request.on('end', () => {
                postData += decoder.end()
                //console.log(typeof postData,': ',postData)
                resolve(postData)
            }) 
        } catch (error) {
            reject(error)
        }
    })
}

function hash(string) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            if (error) reject(error)
            bcrypt.hash(string, salt, (err, hash) => err ? reject(err) : resolve(hash) )
        }) 
    })
}

function base64encode(string){
    let bufferObj = Buffer.from(string, "utf8")
    let base64String = bufferObj.toString("base64")
    return base64String
}
function base64decode(base64string){
    let bufferObj = Buffer.from(base64string, "base64")
    let string = bufferObj.toString("utf8")

    return string
}

function replaceSpecialChars(param) {
    return param.replace(/[=+/]/g, charToBeReplaced =>{
        switch (charToBeReplaced) {
          case '=':
            return ''
          case '+':
            return '-'
          case '/':
            return '_'
        }
      })
}

module.exports = {
    commonResponse,
    isEmptyObject,
    getPostData,
    hash,
    base64encode,
    base64decode,
    replaceSpecialChars
}