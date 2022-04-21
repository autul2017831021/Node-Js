const { findAllPosts,findPostById, storePost, assignUser } = require('../models/postModel.js')
const { getPostData,commonResponse } = require('../helpers/utility.js')


async function getAllPosts(request, response, db){
    var allPosts = await findAllPosts(db)
    commonResponse(response,allPosts,'application/json')
}

async function getPostById(request, response, db, id){
    var singlePost = await findPostById(db,parseInt(id) )
    commonResponse(response,singlePost,'application/json')
}

async function createPost(request, response, db, userInfo){
    const postData = await getPostData(request)
    const newPost = await storePost(db,JSON.parse(postData),userInfo)
    commonResponse(response,newPost,'application/json')
}

async function setAssignee(request,response,db,userInfo){
    const postData = await getPostData(request)
    const newAssignee = await assignUser(db,JSON.parse(postData),userInfo)
    console.log('bal\n',newAssignee)   
    commonResponse(response,newAssignee,'application/json')
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    setAssignee
}