const { assign } = require("../database/repository/post/assign")
const { create } = require("../database/repository/post/create")
const { findAll } = require("../database/repository/post/findAll")
const { findById } = require("../database/repository/post/findById")
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
const assignUserModel = {
    status     : Object,
    isAssigned : Boolean,
    assignee   : Object
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
async function assignUser(db,data,userInfo){
    const newUserModel = getUserModel({})
    const newStatusModel = getStatusModel({})
    let newAssignUserModel = Object.create(assignUserModel)
    newAssignUserModel = {
        status     : newStatusModel,
        isAssigned : false,
        assignee   : newUserModel
    }
    let queryData = {
        postId     : data.postId,
        userId     : userInfo.id,
        isAssigned : data.isAssigned
    }
    const newAssignee = await assign(db,queryData,JSON.stringify(newAssignUserModel))
    return newAssignee
}

module.exports = {
    findAllPosts,
    findPostById,
    storePost,
    getPostModel,
    assignUser
}