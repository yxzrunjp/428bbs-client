import request from '@/utils/request.js'

// 获取用户信息
export const getUserInfo = async (params) => {
    return request({
        url: '/ucenter/getUserInfo',
        params,
    })
}

// 获取用户发帖
export const loadUserArticle = async (params) => {
    return request({
        url: '/ucenter/loadUserArticle',
        params,
        showLoading: false,
    })
}

// 修改个人信息
export const updateUserInfo = async (params) => {
    return request({
        url: '/ucenter/updateUserInfo',
        params,
        dataType: 'file',
    })
}

// 积分记录
export const loadUserIntegralRecord = async (params) => {
    return request({
        url: '/ucenter/loadUserIntegralRecord',
        params,
    })
}

// 获取用户消息数
export const getMessageCount = async () => {
    return request({
        url: '/ucenter/getMessageCount',
    })
}

// 获取消息列表
export const loadMessageList = async (params) => {
    return request({
        url: '/ucenter/loadMessageList',
        params
    })
}

// 获取系统设置
export const getSysSetting = async ()=>{
    return request({
        url:'/getSysSetting',
    })
}