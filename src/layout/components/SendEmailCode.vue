<template>
    <div class="send-email">
        <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :showClose="dialogConfig.showClose"
            :buttons="dialogConfig.buttons" :width="dialogConfig.width" @close="close">
            <el-form :model="formData" :rules="rules" ref="formRef">
                <el-form-item label-width="80px" label="邮箱：">
                    <span>{{ email }}</span>
                </el-form-item>
                <el-form-item label-width="80px" label="验证码：" prop="checkCode">
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
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import { reactive, watch, ref, getCurrentInstance } from 'vue';
import { sendEmailCode } from '@/api/loginAndRegister.js'
const { proxy } = getCurrentInstance()

const formData = reactive({
    checkCode: '',
})
const rules = reactive({
    checkCode: [
        { required: true, message: '请输入验证码' },
    ],
})
const formRef = ref(null)
const handleSendEmailCode = async () => {
    const result = await sendEmailCode({
        email: email.value,
        checkCode: formData.checkCode,
        type: type.value,
    })
    if (!result) {
        // 请求失败,重置验证码
        changeCode()
        formRef.value.resetFields()
        return
    }
    // 重置表单
    formRef.value.resetFields()
    // 提示信息
    proxy.Message.success('发送成功')
    // 关闭窗口
    dialogConfig.show = false
}
const dialogConfig = reactive({
    show: false,
    title: '发送邮箱验证码',
    showClose: true,
    width: '400px',
    buttons: [
        {
            type: 'primary',
            text: '发送',
            style: {
                width: '100px'
            },
            click: () => {
                formRef.value.validate(async v => {
                    if (!v) {
                        return
                    }
                    handleSendEmailCode()
                })
            }
        }
    ]
})

const close = () => {
    dialogConfig.show = false
}
const email = ref('')
const type = ref(0) //0注册,1找回密码
const showEmailCodeDialog = (emailV, typeV) => {
    email.value = emailV
    type.value = typeV
    dialogConfig.show = true
}

// 图片验证码相关
const checkCodeUrl = ref('')
const changeCode = () => {
    checkCodeUrl.value = '/api/checkCode' + `?type=${1}&time=${Date.now()}`
}
watch(() => dialogConfig.show, () => {
    changeCode()
})

defineExpose({
    showEmailCodeDialog
})


</script>

<style lang="scss" scoped>
.send-email {
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

}
</style>