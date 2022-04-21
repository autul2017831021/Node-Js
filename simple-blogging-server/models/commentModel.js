const { create } = require("../database/repository/comment/create")
const { find } = require("../database/repository/comment/find")
const { getPostModel, findPostById } = require("./postModel")
const { getStatusModel } = require("./statusModel")
const { getUserModel } = require("./userModel")

const createCommentModel = {
    status   : Object,
    id       : Number,
    body     : String,
    user     : Object,
    post     : Object
}

const commentsByPostModel = {
    status   : Object,
    comments : Array,
    post     : Object
}

async function storeComment(db,commentData,userInfo){
    const newUserModel = getUserModel(userInfo)
    const newPostModel = getPostModel({"id": parseInt(commentData.postId)})
    const newStatusModel = getStatusModel({})

    let newCreateCommentModel = Object.create(createCommentModel)
    newCreateCommentModel = {
        status  : newStatusModel,
        id      : null,
        body    : null,
        user    : newUserModel,
        post    : newPostModel
    }
    let queryData = {
        body   : commentData.body,
        postId : commentData.postId,
        userId : userInfo.id
    }
    const newComment = await create(db,queryData,JSON.stringify(newCreateCommentModel))
    return newComment
}

async function findComments(db,postId){
    const newPostModel = getPostModel({"id" : postId})
    const newStatusModel = getStatusModel({})

    let newCommentsByPostModel = Object.create(commentsByPostModel)
    newCommentsByPostModel = {
        status   : newStatusModel,
        comments : [],
        post     : newPostModel
    }
    const allComments = await find(db,postId,JSON.stringify(newCommentsByPostModel))
    return allComments
}

module.exports = {
    storeComment,
    findComments
}