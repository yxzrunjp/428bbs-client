<template>
    <div class="edit-article">
        <el-form :model="formData" :rules="rules" ref="formRef">
            <div class="left">
                <el-card :body-style="{ padding: '0' }">
                    <template #header>
                        <div class="left-card-header">
                            <span>正文</span>
                            <span class="change-editor" @click="handleChangeEditor">
                                <i class="iconfont icon-change"></i>
                                切换为{{ formData.editorType === 1 ? '富文本' : 'markdown' }}编辑器
                            </span>
                        </div>
                    </template>
                    <el-form-item :label-width="0" prop="markdownContent" v-if="formData.editorType === 1">
                        <EditorMarkdown v-model="formData.markdownContent" @htmlContent="getMdHtlm"
                            :height="editorHeight" />
                    </el-form-item>
                    <el-form-item v-else :label-width="0" prop="content">
                        <EditorHtml v-model="formData.content" :height="editorHeight" />
                    </el-form-item>
                </el-card>
            </div>
            <div class="right">
                <el-card>
                    <template #header>
                        设置
                    </template>
                    <el-form-item :label-width="60" label="标题" prop="title">
                        <el-input clearable v-model="formData.title" placeholder="请输入..." />
                    </el-form-item>
                    <el-form-item :label-width="60" label="板块" prop="boardIds">
                        <el-cascader clearable v-model="formData.boardIds" :options="boardList" :props="boardProps" />
                    </el-form-item>
                    <el-form-item :label-width="60" label="封面" prop="cover">
                        <UploadImg @upload="handleUpload" v-model="formData.cover">
                            <el-image v-if="imgSrc" class="upload-cover" :src="imgSrc" :fit="'cover'">

                            </el-image>
                            <div v-else class="upload-cover">
                                <i class="iconfont icon-add"></i>
                            </div>
                        </UploadImg>
                    </el-form-item>
                    <el-form-item :label-width="60" label="摘要" prop="summary">
                        <el-input resize="none" :autosize="{ minRows: 4 }" type="textarea" maxlength="200" show-word-limit
                            v-model="formData.summary" />
                    </el-form-item>
                    <el-form-item :label-width="60" label="附件" prop="attachment">
                        <UploadFile v-model="formData.attachment"></UploadFile>
                    </el-form-item>
                    <el-form-item :label-width="60" v-if="formData.attachment" label="积分" prop="integral">
                        <el-input v-model="formData.integral" type="number" placeholder="0积分则下载不需要积分"></el-input>
                    </el-form-item>
                    <el-button class="save-btn" type="primary" @click="submit">保存</el-button>
                </el-card>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, inject, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadBoard, getUpdateArticleInfo, updateArticle, postArticle } from '@/api/article.js'
import UploadImg from '@/components/UploadImg.vue'
import UploadFile from '@/components/UploadFile.vue'
import EditorMarkdown from '@/components/EditorMarkdown.vue'
import EditorHtml from '@/components/EditorHtml.vue'
import { Confirm } from '@/utils/Confirm.js'
const pagePxStore = inject('pagePxStore')
const route = useRoute()
const router = useRouter()
const globalInfo = inject('globalInfo')
const { proxy } = getCurrentInstance()
const articleId = ref(route.params.articleId || '')

const editorHeight = window.innerHeight - pagePxStore.headerHeightPlusSpace - pagePxStore.footerHeightPlusSpace - 64//70为el-card头部
// 表单
const formData = reactive({
    boardIds: [],
    cover: null,//封面，文件流
    attachment: null,//附件，文件流
    integral: 0,//附件下载所需积分 
    pBoardId: null,// 父级板块ID
    boardId: null,//板块ID 
    title: '',//标题  长度 150
    content: '',//内容
    markdownContent: '',// markdown内容 markdown编辑的时候必传 
    editorType: Number(proxy.VueCookies.get('editorType')),//编辑器类型 0:富文本 1:markdown
    summary: '',//简介  长度200
    // 修改用↓
    attachmentType: 0,//0没有附件 1有附件 
    articleId: '',//文章ID
})
const rules = reactive({
    title: [
        { required: true, message: '请输入标题' },
        { max: 150, message: '标题不能超过150字' },
    ],
    boardIds: [
        { required: true, message: '请选择板块' },
    ],
    integral: [
        { required: true, message: '请输入附件所需积分' },
    ],
})
const formRef = ref(null)
const articleDetail = reactive({
    forumArticle: {},
    attachment: null,
})
const submit = () => {
    formRef.value.validate(v => {
        if (!v) {
            return
        }
        // 检查内容
        if (formData.content === '<p><br></p>') {
            proxy.Message.warning('请输入正文内容')
            return
        }
        const params = {}
        Object.assign(params, formData)
        // 板块信息设置
        if (params.boardIds.length > 1) {
            params.pBoardId = params.boardIds[0]
            params.boardId = params.boardIds[1]
        } else if (params.boardIds.length === 1) {
            params.pBoardId = params.boardIds[0]
            delete params.boardId
        }
        delete params.boardIds
        // 附件及封面，没有则不需要传递
        if (!params.attachment) {
            params.attachmentType = 0
        } else {
            params.attachmentType = 1
        }
        if (!(params.attachment instanceof File)) {
            // 不是文件类型，不需要上传
            delete params.attachment
        }
        if (!(params.cover instanceof File)) {
            // 不是文件类型，不需要上传
            delete params.cover
        }
        if (params.editorType === 0) {
            delete params.markdownContent
        }
        submitArticle(params)
    })
}
const submitArticle = async (params) => {
    let result = null
    let successMsg = ''
    if (articleId.value) {
        // 修改
        result = await updateArticle(params)
        successMsg = '修改成功！'
    } else {
        // 新增
        delete params.articleId
        delete params.boardIds
        result = await postArticle(params)
        successMsg = '发帖成功！'
    }
    if (!result) {
        return
    }
    proxy.Message.success(successMsg)
    router.push(`/articleDetail/${result.data}`)
}

// 获取修改的文章详情
const getArticleDetail = async () => {
    const params = {
        articleId: articleId.value
    }
    const result = await getUpdateArticleInfo(params)
    if (!result) {
        router.replace('/')
        return
    }
    Object.assign(articleDetail, result.data)
    const forumArticle = articleDetail.forumArticle
    const attachment = articleDetail.attachment
    // 设置文章信息
    for (const key in formData) {
        if (key === 'cover') {
            formData[key] = {
                url: forumArticle[key]
            }
            continue
        } else if (key === 'boardIds') {
            continue
        }
        formData[key] = forumArticle[key]
    }
    // 设置板块信息
    formData.boardIds.push(forumArticle.pBoardId)
    if (forumArticle.boardId) {
        formData.boardIds.push(forumArticle.boardId)
    }
    if (attachment) {
        // 设置附件信息
        formData.attachment = {
            name: attachment.fileName,
            ...attachment
        }
        // 设置积分
        formData.integral = attachment.integral
    }
    // 设置封面
    if (forumArticle.cover) {
        imgSrc.value = globalInfo.getImageUrl + '/' + forumArticle.cover
    }

}

// 编辑器
const handleChangeEditor = () => {
    Confirm('该操作会将现在编辑器的内容清空，确定执行？', '提示', () => {
        const type = formData.editorType === 0 ? 1 : 0
        formData.content = ''
        formData.markdownContent = ''
        // 保存用户所用的编辑器到cookies中
        proxy.VueCookies.set('editorType', type)
        formData.editorType = type
    })
}
const getMdHtlm = (e) => {
    formData.content = e
}

// 板块
const boardList = reactive([])
const boardProps = {
    expandTrigger: 'hover',
    children: 'children',
    value: 'boardId',
    label: 'boardName',
    checkStrictly: true,
}
// 获取能发布的板块信息
const getBoard = async () => {
    const result = await loadBoard()
    if (!result) {
        return
    }
    Object.assign(boardList, result.data)
}

// 封面
const imgSrc = ref('')
const handleUpload = (file, dataUrl) => {
    imgSrc.value = dataUrl
}

const init = async () => {
    await getBoard()
    if (articleId.value) {
        await getArticleDetail()
    }
}
init()
</script>

<style lang="scss" scoped>
.edit-article {

    width: 100vw;

    .el-form {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .left {
            width: calc(100% - 460px);

            .el-form-item {
                margin-bottom: 0px;
            }

            .left-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .change-editor {
                    font-size: 14px;
                    cursor: pointer;
                    color: $color-blue;

                    &:hover {
                        color: $color-dark-blue;
                    }
                }
            }
        }

        .right {
            width: 450px;
            margin-left: 10px;

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

            .save-btn {
                width: 200px;
                margin: 0 auto;
                display: block;
            }
        }

    }



}
</style>