<template>
    <div class="comment-input">
        <div class="input-part">
            <Avatar :size="avatarSize" :userId="userId" :link="false" />
            <el-form :model="formData" ref="formRef">
                <el-form-item prop="content">
                    <el-input :placeholder="placeholder" v-model="formData.content" :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none" maxlength="800" show-word-limit type="textarea" />
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleSend">发送</el-button>
        </div>
        <template v-if="showOptions">
            <div class="options" v-if="!srcList.length">
                <div class="option-item">
                    <UploadImg @upload="handleUpload">
                        <i class="iconfont icon-image"></i>
                    </UploadImg>
                </div>
            </div>
            <div class="upload-content" v-else>
                <div class="upload-img-item" v-for="src in srcList" :key="src">
                    <CommentImage :src="src" :srcList="srcList" />
                    <span @click="handleRemove(src)" class="remove iconfont icon-remove"></span>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { reactive, ref, inject, getCurrentInstance } from 'vue'
import UploadImg from '@/components/UploadImg.vue';
import { postComment } from '@/api/comment.js'
import { useCheckLoginHook } from '@/utils/hooks.js'
import CommentImage from './CommentImage.vue';
const { proxy } = getCurrentInstance()
const forumArticle = inject('forumArticle')

const props = defineProps({
    avatarSize: {
        type: Number,
        default: 50
    },
    showOptions: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
        default: null,
    },
    pCommentId: {
        type: Number,
        default: 0,
    },
    replyUserId: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '请输入...',
    }
})

const formRef = ref(null)
const rules = reactive({
    content: [
        { required: true, message: '请输入评论' },
        { min: 5, message: '字数要大于5' },
    ]
})
const formData = reactive({
    content: '',
})

// 回复信息
const emit = defineEmits(['commitFinish'])
const handleSend = () => {
    // 验证是否登录
    const { isLogin } = useCheckLoginHook()
    if (!isLogin) {
        proxy.Message.warning('请先登录')
        return
    }

    // 图片与内容至少存在一个
    if (!imgFile.file) {
        // 没有图片，检查内容，字数大于5
        if (!formData.content) {
            proxy.Message.warning('请输入内容')
            return
        }else if(formData.content.length<5){
            proxy.Message.warning('内容至少五个字')
            return
        }
    }
    commitComment()
}
const commitComment = async () => {
    const params = {
        articleId: forumArticle.value.articleId,
        pCommentId: props.pCommentId,
        content: formData.content,
        replyUserId: props.replyUserId,
    }
    if (imgFile.file) {
        params.image = imgFile.file
    }
    const result = await postComment(params)
    if (!result) {
        return
    }
    proxy.Message.success('评论发表成功')
    formData.content = ''
    removeImgFile()
    emit('commitFinish')
}

// 图片预览
const srcList = reactive([])
const imgFile = reactive({
    file: null,
})
const handleUpload = (file, dataUrl) => {
    imgFile.file = file
    srcList.push(dataUrl)
}
const handleRemove = (src) => {
    const idx = srcList.findIndex(e => {
        return e === src
    })
    srcList.splice(idx, 1)
    imgFile.file = null
}
const removeImgFile = () => {
    // 当前只支持上传一张图，后续考虑改成上传多张图
    srcList.splice(0, srcList.length)
    imgFile.file = null
}
</script>

<style lang="scss" scoped>
.comment-input {
    .input-part {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 10px 0px 15px;

        .el-form {
            flex: 1;
            margin: 0 10px;

            .el-form-item {
                margin-bottom: 0;
            }
        }

        .el-button {
            height: 50px;
        }
    }

    .options {
        margin-left: 60px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .option-item {
            color: $color-font;
            cursor: pointer;
            margin-right: 10px;

            &:hover {
                color: $color-dark-blue;
            }

            .iconfont {
                font-size: 20px;
            }
        }
    }

    .upload-content {
        margin-left: 60px;
        margin-top: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .upload-img-item {
            position: relative;
            margin-right: 10px;

            .remove {
                position: absolute;
                color: $color-font;
                font-size: 20px;
                top: -10px;
                right: -10px;
                cursor: pointer;
            }
        }
    }

}
</style>