<template>
    <div class="update-form">
        <el-form :model="formData" :rules="rules" ref="formRef">
            <el-form-item prop="email">
                <el-input clearable placeholder="请输入邮箱" v-model="formData.email">
                    <template #prefix>
                        <span class="iconfont icon-account"></span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="emailCode">
                <div class="email-code">
                    <el-input clearable placeholder="请输入邮箱验证码" v-model="formData.emailCode">
                        <template #prefix>
                            <span class="iconfont icon-checkcode"></span>
                        </template>
                    </el-input>
                    <el-button type="primary" @click="getEmailCode">获取验证码</el-button>
                </div>
                <el-popover placement="left" :width="400" trigger="click">
                    <div class="tip-wrap">
                        <p>1、在垃圾箱中查找邮箱验证码</p>
                        <p>2、在邮箱中 头像-&gt;设置-&gt;反垃圾-&gt;白名单-&gt;设置邮件地址白名单</p>
                    </div>
                    <template #reference>
                        <el-button link type="primary">未收到邮箱验证码？</el-button>
                    </template>
                </el-popover>
            </el-form-item>
            <el-form-item prop="password">
                <el-input clearable type="password" show-password placeholder="请输入密码" v-model="formData.password">
                    <template #prefix>
                        <span class="iconfont icon-password"></span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="rePwd">
                <el-input clearable type="password" show-password placeholder="请再次输入密码" v-model="formData.rePwd">
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
            <div class="ohter-options">
                <el-button link type="primary" @click="handleOption()">登录</el-button>
            </div>
            <el-form-item>
                <el-button type="primary" :style="{ width: '100%' }" @click="handleReset">重置密码</el-button>
            </el-form-item>
        </el-form>
    </div>
    <SendEmailCode ref="sendCode"></SendEmailCode>
</template>

<script setup>
import SendEmailCode from './SendEmailCode.vue';
import { onMounted, onBeforeUnmount, reactive, ref, getCurrentInstance } from 'vue';
import { resetPwd } from '@/api/loginAndRegister.js'
const { proxy } = getCurrentInstance()
const formData = reactive({
    email: '',
    password: '',
    rePwd: '',
    emailCode: '',//邮箱验证码
    checkCode: '',//图片验证码
    // rememberMe: true,
})
const rePswValidator = (rule, value, callback) => {
    if (value === formData.password) {
        callback()
    } else {
        callback(new Error(rule.message))
    }
}
const rules = reactive({
    email: [
        { required: true, message: '请输入邮箱' },
        { validator: proxy.verify.email, message: '邮箱格式不正确' },
    ],
    password: [
        { required: true, message: '请输入密码' },
        { min: 8, max: 18, message: '密码应为8位到18位' },
        { validator: proxy.verify.password, message: '密码应由数字、字母共同组成' },
    ],
    rePwd: [
        { required: true, message: '请再次输入密码' },
        { validator: rePswValidator, message: '密码不一致' },
    ],
    emailCode: [
        { required: true, message: '请输入邮件验证码' },
    ],
    checkCode: [
        { required: true, message: '请输入图片验证码' },
    ],
})
const formRef = ref(null)
const handleReset = () => {
    formRef.value.validate(v => {
        if (!v) {
            return
        }
        submitReset()
    })
}
const submitReset = async () => {
    const params = {}
    Object.assign(params, formData)
    delete params.rePwd
    const result = await resetPwd(params)
    if (!result) {
        return
    }
    proxy.Message.success('修改成功')
    // 清除登录信息的密码
    const loginInfo = proxy.VueCookies.get('loginInfo')
    if(loginInfo){
        loginInfo.password = ''
        proxy.VueCookies.set('loginInfo',loginInfo,'7d')
    }
    // 回到登录表单
    handleOption()
}

const sendCode = ref(null)
// 获取邮箱验证码事件
const getEmailCode = () => {
    formRef.value.validateField('email', (v) => {
        if (!v) {
            return
        }
        sendCode.value.showEmailCodeDialog(formData.email, 1)
    })
}

// 图片验证码相关
const checkCodeUrl = ref('')
const changeCode = () => {
    checkCodeUrl.value = '/api/checkCode' + `?type=${0}&time=${Date.now()}`
}

// 切换表单
const emit = defineEmits(['change','closeForm'])
const handleOption = () => {
    emit('change', 'login')
}

onMounted(() => {
    changeCode()
})
</script>

<style lang="scss" scoped>
.update-form {
    .email-code {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .el-button {
            margin-left: 10px;
        }
    }

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