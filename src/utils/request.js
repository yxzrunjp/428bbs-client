import axios from 'axios'
import Message from '@/utils/Message.js'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import settings from '@/utils/settings.js'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8';
const contentTypeJson = 'application/json';
const contentTypeFile = 'multipart/form-data';

const instance = axios.create({
    baseURL: '/api',
    timeout: 10 * 1000,
})
let loadObj = null;
const closeLoading = () => {
    if (loadObj) {
        loadObj.close()
    }
}
instance.interceptors.request.use((config) => {
    if (config.showLoading) {
        loadObj = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
    }
    return config
}, (error) => {
    closeLoading()
    return Promise.reject('请求发送失败')
})

instance.interceptors.response.use((response) => {
    const { data, config } = response
    if (config.showLoading) {
        closeLoading()
    }
    if (data.code === 200) {
        return data
    } else if (data.code === 901) {
        const userInfoStore = useUserInfoStore()
        const loginSettingStore = useLoginSettingStore()
        // 登录过期，重置用户信息
        userInfoStore.$reset()
        // 弹出登录框
        loginSettingStore.title = settings.loginFormTitle.login
        loginSettingStore.show = true
        return Promise.reject('登录超时')
    } else {
        return Promise.reject(data.info)
    }

}, (error) => {
    closeLoading()
    return Promise.reject('网络异常')
})

const request = (config) => {
    let { url, params, dataType, showLoading = true } = config
    let contentType = ''
    if (dataType === 'file') {
        contentType = contentTypeFile
        const formData = new FormData()
        for (const key in params) {
            formData.append(key, params[key])
        }
        params = formData
    } else if (dataType === 'json') {
        contentType = contentTypeJson
    } else {
        contentType = contentTypeForm
    }
    const headers = {
        "Content-Type": contentType,
        "X-Requested-With": "XMLHttpRequest"
    }

    return instance.post(url, params, { headers, showLoading }).catch(err => {
        Message.error(err)
    })
}
export default request