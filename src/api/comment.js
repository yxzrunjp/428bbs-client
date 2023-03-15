import request from '@/utils/request.js'

// 获取文章评论
export const loadComment = async (params) => {
    return request({
        url: '/comment/loadComment',
        params,
        showLoading: false,
    })
}

// 发布评论
export const postComment = async (params) => {
    return request({
        url: '/comment/postComment',
        params,
        showLoading: false,
        dataType: 'file'
    })
}

// 评论点赞
export const doLike = async (params) => {
    return request({
        url: '/comment/doLike',
        params,
        showLoading: false,
    })
}

// 置顶或取消置顶
export const changeTopType = async (params) => {
    return request({
        url: '/comment/changeTopType',
        params,
        showLoading: false,
    })
}
