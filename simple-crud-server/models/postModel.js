const { create } = require("../database/repository/post/create")
const { remove } = require("../database/repository/post/delete")
const { findAll } = require("../database/repository/post/findAll")
const { findById } = require("../database/repository/post/findById")
const { update } = require("../database/repository/post/update")
const { getStatusModel } = require("./statusModel")
const { getUserModel } = require("./userModel")

const postModel = {
    id     : Number,
    title  : String,
    body   : String
}
const allPostsModel = {
    status : Object,
    posts  : Array,
}
const createPostModel = {
    status : Object,
    post   : Object,
    user   : Object
}

function getPostModel(paramObj){
    let newPostModel = Object.create(postModel)
    newPostModel = {
        id     : typeof paramObj.id !== 'undefined' ? paramObj.id : null,
        title  : typeof paramObj.title !== 'undefined' ? paramObj.title : null,
        body   : typeof paramObj.body !== 'undefined' ? paramObj.body : null
    }
    return newPostModel
}

async function findAllPosts(db){
    const newStatusModel = getStatusModel({})
    let newAllPostsModel = Object.create(allPostsModel)
    newAllPostsModel = {
        status : newStatusModel,
        posts  : []
    }
    const allPosts = await findAll(db,JSON.stringify(newAllPostsModel))
    return allPosts
}
async function findPostById(db,id){
    const newStatusModel = getStatusModel({})
    let newSinglePostsModel = Object.create(allPostsModel)
    newSinglePostsModel = {
        status : newStatusModel,
        posts  : []
    }
    const singlePost = await findById(db,id,JSON.stringify(newSinglePostsModel))
    return singlePost
}
async function storePost(db,data,userInfo){
    const newUserModel = getUserModel(userInfo)
    const newStatusModel = getStatusModel({})
    const newPostModel = getPostModel({})
    let newCreatePostModel = Object.create(createPostModel)
    newCreatePostModel = {
        status : newStatusModel,
        post   : newPostModel,
        user   : newUserModel
    }
    let queryData = {
        title  : data.title,
        body   : data.body,
        userId : userInfo.id
    }
    const newPost = await create(db,queryData,JSON.stringify(newCreatePostModel))
    return newPost
}
async function updatePost(db,data,existingPost,id){
    const updatedPost = await update(db,data,JSON.stringify(existingPost),id)
    return updatedPost
}
async function deletePost(db,id){
    const newStatusModel = getStatusModel({})
    newDeletePostModel = {
        status : newStatusModel
    }
    const msg = await remove(db,JSON.stringify(newDeletePostModel),id)
    return msg
}
module.exports = {
    findAllPosts,
    findPostById,
    storePost,
    updatePost,
    deletePost,
    getPostModel
}