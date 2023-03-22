import request from '@/utils/request.js'

// 获取文章列表
export const loadArticle = async (params, showLoading) => {
    return request({
        url: '/forum/loadArticle',
        params: params ? params : null,
        showLoading,
    })
}

// 获取文章详情
export const getArticleDetail = async (params) => {
    return request({
        url: '/forum/getArticleDetail',
        params,
    })
}

// 点赞
export const doLike = async (params) => {
    return request({
        url: '/forum/doLike',
        params,
        showLoading: false,
    })
}

// 获取用户下载信息
export const getUserDownloadInfo = async (params) => {
    return request({
        url: '/forum/getUserDownloadInfo',
        params,
        showLoading: false,
    })
}

// 上传图片
export const uploadImg = async (params) => {
    return request({
        url: '/file/uploadImage',
        params,
        dataType: 'file',
    })
}

// 获取能发布的板块信息
export const loadBoard = async () => {
    return request({
        url: '/forum/loadBoard4Post',
    })
}


// 发布文章
export const postArticle = async (params) => {
    return request({
        url: "/forum/postArticle",
        params,
        dataType: 'file'
    })
}

// 修改文章
export const updateArticle = async (params) => {
    return request({
        url: "/forum/updateArticle",
        params,
        dataType: 'file',
    })
}

// 获取修改的文章详情
export const getUpdateArticleInfo = async (params) => {
    return request({
        url: "/forum/articleDetail4Update",
        params,
    })
}

// /forum/search
export const searchArticle = async (params) => {
    return request({
        url: '/forum/search',
        params,
    })
}