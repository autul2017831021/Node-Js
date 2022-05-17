const http = require('http')
const url = require('url')
const {StringDecoder} = require('string_decoder')
const { db }= require('./database/dbConnection.js')
const { getAllPosts,getPostById,createPost, setAssignee } = require('./controllers/postController.js')
const { getApiReqResTime } = require('./api-request-response-time/apiReqResTime.js')
const { register,login } = require('./controllers/authController.js')
const { verifyJwt } = require('./middleware/auth/verifyJwt.js')
const { notFound, forbidden, invalidToken } = require('./controllers/errorHandleController.js')
const { base64decode } = require('./helpers/utility.js')
const { createComment, getCommentsByPostId } = require('./controllers/commentController.js')

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
    if(path === '/api/blog' && verifyJwt(request) && request.method === 'GET'){
        commonCallBack(path)
        getAllPosts(request,response,db)
    }
    else if(parsedUrl.pathname === '/api/blog' && typeof parsedUrl.query.id !== 'undefined' && verifyJwt(request) && request.method === 'GET'){
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
    else if(path === '/api/blog/assign' && verifyJwt(request) && request.method === 'POST'){
        commonCallBack(path)
        const payload = request.headers.authorization.split(' ')[1].split('.')[1]
        const userInfo = JSON.parse(base64decode(payload))
        setAssignee(request,response,db,userInfo)
    }
    else if(parsedUrl.pathname === '/api/blog/comment/get' && typeof parsedUrl.query.postId !== 'undefined' && verifyJwt(request) && request.method === 'GET'){
        commonCallBack(path)
        const postId = parsedUrl.query.postId
        getCommentsByPostId(request,response,db,postId)
    }
    else if(path === '/api/blog/comment/create' && verifyJwt(request) && request.method === 'POST'){
        commonCallBack(path)
        const payload = request.headers.authorization.split(' ')[1].split('.')[1]
        const userInfo = JSON.parse(base64decode(payload))
        createComment(request,response,db,userInfo)
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
