<template>
    <div class="login-form">
        <el-form :model="formData" :rules="rules" ref="formRef">
            <el-form-item prop="email">
                <el-input clearable placeholder="请输入邮箱" v-model="formData.email">
                    <template #prefix>
                        <span class="iconfont icon-account"></span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input clearable type="password" show-password placeholder="请输入密码" v-model="formData.password">
                    <template #prefix>
                        <span class="iconfont icon-password"></span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="checkCode">
                <div class="check-wrap">
                    <el-input clearable placeholder="请输入验证码" v-model="formData.checkCode">
                        <template #prefix>
                            <span class="iconfont icon-checkcode"></span>
                        </template>
                    </el-input>
                    <div class="code-img">
                        <img :src="checkCodeUrl" alt="验证码" @click="changeCode">
                    </div>
                </div>
            </el-form-item>
            <el-form-item prop="rememberMe">
                <el-checkbox v-model="formData.rememberMe" label="记住我" />
            </el-form-item>
            <div class="ohter-options">
                <el-button link type="primary" @click="handleOption('update')">重置密码</el-button>
                <el-button link type="primary" @click="handleOption('register')">注册账号</el-button>
            </div>
            <el-form-item>
                <el-button type="primary" :style="{ width: '100%' }" @click="handleLogin">登录</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from 'vue';
import { login } from '@/api/loginAndRegister.js'
import md5 from 'js-md5'
import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore()
const { proxy } = getCurrentInstance()
const formData = reactive({
    email: '',
    password: '',
    checkCode: '',
    rememberMe: false,
})
const rules = reactive({
    email: [
        { required: true, message: '请输入邮箱' },
    ],
    password: [
        { required: true, message: '请输入密码' },
    ],
    checkCode: [
        { required: true, message: '请输入图片验证码' },
    ],
})
const formRef = ref(null)
// const resetForm = () => {
//     formRef.value.resetFields()
// }
// 登录事件处理
const handleLogin = () => {
    formRef.value.validate(v => {
        if (!v) {
            return
        }
        submitLogin()
    })
}
// 提交表单
const submitLogin = async () => {
    const params = {}
    Object.assign(params, formData)
    const cookieLoginInfo = proxy.VueCookies.get('loginInfo')
    if (cookieLoginInfo?.password !== params.password) {
        params.password = md5(params.password)
    }
    const result = await login(params)
    if (!result) {
        // 更新验证码
        changeCode()
        // 重置密码和验证码
        formData.password = ''
        formData.checkCode = ''
        return
    }
    if (params.rememberMe) {
        // 记住用户登录信息
        delete params.checkCode
        proxy.VueCookies.set('loginInfo', params, '7d')
    } else {
        // 删除过去保存的登录信息
        proxy.VueCookies.remove('loginInfo')
    }
    // const userInfo = result.data
    // 获取登录信息
    await userInfoStore.getLoginUserInfo()
    // userInfoStore.$patch(result.data)
    // 备份登录信息
    // proxy.VueCookies.set('userInfo', userInfo, '7d')
    proxy.Message.success('登录成功')
    // setTimeout(()=>{
    //     // 重新加载页面
    //     document.location.reload()
    // },500)
    closeForm()
}

// 图片验证码相关
const checkCodeUrl = ref('')
const changeCode = () => {
    checkCodeUrl.value = '/api/checkCode' + `?type=${0}&time=${Date.now()}`
}

// 切换表单
const emit = defineEmits(['change', 'closeForm'])
const handleOption = (type) => {
    emit('change', type)
}
// 关闭表单
const closeForm = () => {
    emit('closeForm')
}

const getCookiesLoginInfo = () => {
    const loginInfo = proxy.VueCookies.get('loginInfo')
    if (!loginInfo) {
        return
    }
    Object.assign(formData, loginInfo)
}
onMounted(() => {
    changeCode()
    getCookiesLoginInfo()
})


const reset = () => {
}
defineExpose({
    reset
})
</script>

<style lang="scss" scoped>
.login-form {
    .check-wrap {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .el-input {
            width: calc(100% - 110px);
        }

        .code-img {
            width: 100px;
            margin-left: 10px;
            font-size: 0;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                cursor: pointer;
                width: 100%;
            }
        }
    }

    .ohter-options {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
}
</style>