const { getPostData, commonResponse } = require("../helpers/utility")
const { storeComment, findComments } = require("../models/commentModel")

async function createComment(request,response,db,userInfo){
    const postData = await getPostData(request)
    const newComment = await storeComment(db, JSON.parse(postData), userInfo)
    commonResponse(response,newComment,'application/json')
}

async function getCommentsByPostId(request,response,db,postId){
    const comments = await findComments(db,parseInt(postId))
    commonResponse(response,comments,'application/json')
}

module.exports = {
    createComment,
    getCommentsByPostId
}