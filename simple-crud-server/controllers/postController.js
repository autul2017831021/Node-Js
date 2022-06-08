const { findAllPosts,findPostById, storePost, updatePost, deletePost } = require('../models/postModel.js')
const { getPostData,commonResponse } = require('../helpers/utility.js')

async function getAllPosts(request, response, db){
    var allPosts = await findAllPosts(db)
    commonResponse(response,allPosts,'application/json')
}
async function getPostById(request, response, db, id){
    var singlePost = await findPostById(db,id)
    commonResponse(response,singlePost,'application/json')
}
async function createPost(request, response, db, userInfo){
    const postData = await getPostData(request)
    const newPost = await storePost(db,JSON.parse(postData),userInfo)
    commonResponse(response,newPost,'application/json')
}
async function updatePostById(request,response,db,userInfo,id){
    const postData = JSON.parse(await getPostData(request))
    const updateData = {
        title     : typeof postData.title !== 'undefined' ? postData.title : null,
        body      : typeof postData.body !== 'undefined' ? postData.body : null,
        updatedAt : new Date()
    }
    var singlePost = await findPostById(db,id)
    if(!singlePost.status.success){
        commonResponse(response,singlePost,'application/json')
    }
    else if(singlePost.posts[0].user_id !== userInfo.id){
        singlePost.status.success = false
        singlePost.status.code = 403
        singlePost.status.message = "You Are Not Authorized TO Perform This Action"
        commonResponse(response,singlePost,'application/json')
    }
    else{
        const updatedPost = await updatePost(db,updateData,singlePost,id)
        commonResponse(response,updatedPost,'application/json')
    } 
}
async function deletePostById(request,response,db,userInfo,id){
    var singlePost = await findPostById(db,id)
    if(!singlePost.status.success){
        commonResponse(response,singlePost,'application/json')
    }
    else if(singlePost.posts[0].user_id !== userInfo.id){
        singlePost.status.success = false
        singlePost.status.code = 403
        singlePost.status.message = "You Are Not Authorized TO Perform This Action"
        commonResponse(response,singlePost,'application/json')
    }
    else{
        const deleteMsg = await deletePost(db,id)
        commonResponse(response,deleteMsg,'application/json')
    } 
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePostById,
    deletePostById
}