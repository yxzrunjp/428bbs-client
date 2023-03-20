<template>
    <div class="edit-info">
        <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :show-close="dialogConfig.showClose"
            :buttons="dialogConfig.buttons" width="400px">
            <el-form :label-width="60" :rules="rules" :model="formData" ref="formRef">
                <el-form-item label="昵称">
                    {{ data.nickName }}
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <UploadImg @upload="handleUpload" v-model="formData.avatar">
                        <el-image v-if="imgSrc" class="upload-cover" :src="imgSrc" :fit="'cover'">
                        </el-image>
                        <div v-else class="upload-cover">
                            <i class="iconfont icon-add"></i>
                        </div>
                    </UploadImg>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="formData.sex">
                        <el-radio :label="0" size="large">女</el-radio>
                        <el-radio :label="1" size="large">男</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="简介" prop="personDescription">
                    <el-input :placeholder="'请输入简介'" v-model="formData.personDescription"
                        :autosize="{ minRows: 2, maxRows: 3 }" resize="none" maxlength="100" show-word-limit
                        type="textarea" />
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import UploadImg from '@/components/UploadImg.vue';
import { ref, reactive, inject, watch } from 'vue'
import { updateUserInfo } from '@/api/user.js'
const { avatarUrl } = inject('globalInfo')
const emit = defineEmits(['submit'])
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {

            }
        }
    }
})

const dialogConfig = reactive({
    show: false,
    title: '修改资料',
    showClose: false,
    buttons: [
        {
            type: 'danger',
            text: '取消',
            click: () => {
                resetFormData()
                closeDialog()
            },
        },
        {
            type: 'primary',
            text: '确定',
            click: () => {
                formRef.value.validate(v => {
                    if (!v) {
                        return
                    }
                    handleSubmit()
                })
            },
        },
    ],
})
const showDialog = () => {
    dialogConfig.show = true
}
const closeDialog = () => {
    dialogConfig.show = false
}

const rules = reactive({
    sex: [{ required: true, message: '请选择性别' }],
})
const formData = reactive({
    sex: 0,//性别 0:女 1:男
    personDescription: '',//个人描述
    avatar: null,//头像 图片文件流
})
const formRef = ref(null)
const handleSubmit = async () => {
    const params = {}
    Object.assign(params, formData)
    const result = await updateUserInfo(params)
    if (!result) {
        return
    }
    // 重新加载页面以更新数据
    if (params.avatar instanceof File) {
        document.location.reload()
    }else{
        emit('submit')
        closeDialog()
    }
}

const imgSrc = ref(``)//头像url
const handleUpload = (file, url) => {
    imgSrc.value = url
}

// 用户信息备份
const userInfo = {}
// 重新设置用户信息
const resetFormData = () => {
    formData.sex = userInfo.sex
    formData.personDescription = userInfo.personDescription
    imgSrc.value = `${avatarUrl}/${userInfo.userId}`
}

watch(() => props.data, (newV) => {
    for (const key in newV) {
        userInfo[key] = newV[key]
    }
    resetFormData()
}, { deep: true })

defineExpose({
    showDialog,
})
</script>

<style lang="scss" scoped>
.edit-info {
    .el-form-item {
        align-items: center;
    }

    .el-radio {
        margin-right: 15px;
    }

    .upload-cover {
        width: 150px;
        height: 150px;
        overflow: hidden;
        border-radius: 10px;
        background-color: #ddd;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
            font-size: 40px;
        }
    }
}
</style>