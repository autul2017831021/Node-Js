const http = require('http')
const url = require('url')
const {StringDecoder} = require('string_decoder')
const { db }= require('./database/dbConnection.js')
const { getAllPosts,getPostById,createPost, updatePostById, deletePostById } = require('./controllers/postController.js')
const { getApiReqResTime } = require('./api-request-response-time/apiReqResTime.js')
const { register,login } = require('./controllers/authController.js')
const { verifyJwt } = require('./middleware/auth/verifyJwt.js')
const { notFound, forbidden, invalidToken } = require('./controllers/errorHandleController.js')
const { base64decode } = require('./helpers/utility.js')
const { getUserProfile, updateUserProfile } = require('./controllers/userController.js')
const { updateProfileAuth } = require('./helpers/role.js')

const port = 8080

function getDate(dateObj){
    return 'Request Time : '+getApiReqResTime(dateObj)
}
function getEndpointName(endpoint){
    return 'Endpoint : http://localhost:'+port+endpoint
}
function commonCallBack(path){
    console.log( getEndpointName(path) )
    console.log( getDate(new Date()) )
}

function main(request, response){
    var path = request.url
    var parsedUrl = url.parse(request.url, true)
    if(path === '/api/blog/get' && verifyJwt(request) && request.method === 'GET'){
        commonCallBack(path)
        getAllPosts(request,response,db)
    }
    else if(parsedUrl.pathname === '/api/blog/get' && typeof parsedUrl.query.id !== 'undefined' && verifyJwt(request) && request.method === 'GET'){
        commonCallBack(path)
        const id = parsedUrl.query.id
        getPostById(request,response,db,id)
    }
    else if(path === '/api/blog/create' && verifyJwt(request) && request.method === 'POST'){
        commonCallBack(path)
        const payload = request.headers.authorization.split(' ')[1].split('.')[1]
        const userInfo = JSON.parse(base64decode(payload))
        createPost(request,response,db,userInfo)
    }
    else if(parsedUrl.pathname === '/api/blog/update' && typeof parsedUrl.query.id !== 'undefined' && verifyJwt(request) && request.method === 'PUT'){
        commonCallBack(path)
        const id = parsedUrl.query.id
        const payload = request.headers.authorization.split(' ')[1].split('.')[1]
        const userInfo = JSON.parse(base64decode(payload))
        updatePostById(request,response,db,userInfo,id)
    }
    else if(parsedUrl.pathname === '/api/blog/delete' && typeof parsedUrl.query.id !== 'undefined' && verifyJwt(request) && request.method === 'DELETE'){
        commonCallBack(path)
        const id = parsedUrl.query.id
        const payload = request.headers.authorization.split(' ')[1].split('.')[1]
        const userInfo = JSON.parse(base64decode(payload))
        deletePostById(request,response,db,userInfo,id)
    }
    else if(parsedUrl.pathname === '/api/profile/get' && typeof parsedUrl.query.username !== 'undefined' && verifyJwt(request) && request.method === 'GET'){
        commonCallBack(path)
        const username = parsedUrl.query.username
        getUserProfile(request,response,db,username)
    }
    else if(parsedUrl.pathname === '/api/profile/update' && typeof parsedUrl.query.username !== 'undefined' && verifyJwt(request) && updateProfileAuth(request,parsedUrl.query.username) && request.method === 'PUT'){
        commonCallBack(path)
        const payload = request.headers.authorization.split(' ')[1].split('.')[1]
        const userInfo = JSON.parse(base64decode(payload))
        updateUserProfile(request,response,db,userInfo,request.headers.authorization.split(' ')[1])
    }
    else if(path === '/api/login' && request.method === 'POST'){
        commonCallBack(path)
        login(request,response,db)
    }
    else if(path === '/api/register' && request.method === 'POST'){
        commonCallBack(path)
        register(request,response,db)
    }
    else if(verifyJwt(request)){
        commonCallBack(path)
        notFound(request,response)
    }
    else{
        commonCallBack(path)
        invalidToken(request,response)
    } 
}

http.createServer(main).listen(port,()=>{
    console.log("Server running on http://localhost:%i",port)
})
