
import request from '@/utils/request.js'

// 发送邮箱验证码
export const sendEmailCode = async (params) => {
    return request({
        url: '/sendEmailCode',
        params,
    })
}

// 注册
export const register = async (params) => {
    return request({
        url:'/register',
        params
    })
}

// 登录
export const login = async (params) => {
    return request({
        url:'/login',
        params
    })
}

// 找回密码
export const resetPwd = async (params) => {
    return request({
        url:'/resetPwd',
        params
    })
}

// 获取登录的用户信息
export const getUserInfo = async (params)=>{
    return request({
        url:'/getUserInfo',
        params
    })
}

// 获取板块信息
export const loadBoard = async ()=>{
    return request({
        url:'/board/loadBoard',
    })
}