<template>
    <div class="article-detail" :style="{ width: `${mainWidth}px` }">
        <div class="breadcrumb-box">
            <el-breadcrumb :separator-icon="ArrowRight">
                <!-- <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item> -->
                <el-breadcrumb-item :to="'/articleList/' + forumArticle.pBoardId" v-if="forumArticle.pBoardName">{{
                    forumArticle.pBoardName
                }}</el-breadcrumb-item>
                <el-breadcrumb-item :to="`/articleList/${forumArticle.pBoardId}/${forumArticle.boardId}`"
                    v-if="forumArticle.boardName">{{
                        forumArticle.boardName }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ forumArticle.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="page-content">
            <div class="left">
                <div class="article-info">
                    <div class="article-title">
                        <div class="title-text">{{ forumArticle.title }}</div>
                        <el-tag v-if="forumArticle.status === 0" type="warning" effect="plain" class="top-tag">待审核</el-tag>
                    </div>
                    <div class="author-info">
                        <div class="author-left">
                            <Avatar :userId="forumArticle.userId" :size="50"></Avatar>
                        </div>
                        <div class="author-right">
                            <div class="nickname">
                                <router-link :to="`/user/${forumArticle.userId}`">
                                    {{ forumArticle.nickName }}
                                </router-link>
                            </div>
                            <div class="other-info">
                                <span>{{ forumArticle.postTime }}</span>
                                <span class="dot">·</span>
                                <span>{{ forumArticle.userIpAddress }}</span>
                                <i class="iconfont icon-eye-solid"></i>
                                <span>{{ forumArticle.readCount }}</span>
                                <template v-if="forumArticle.userId === userId">
                                    <router-link :to="`/article/${forumArticle.articleId}`">
                                        <span class="edit text-btn">
                                            <i class="iconfont icon-edit"></i>
                                            编辑
                                        </span>
                                    </router-link>
                                </template>
                            </div>
                        </div>
                    </div>
                    <PreviewHtml :html="forumArticle.content" @click="previewClick" @load="htmlLoad" />
                </div>
                <div class="file-info" v-if="attachment" id="file-box">
                    <div>附件</div>
                    <div class="info-box">
                        <span class="file-name">
                            <i class="iconfont icon-zip"></i>
                            {{ attachment.fileName }}
                        </span>
                        <span class="space">{{ sizeTranslate(attachment.fileSize) }}</span>
                        <span>需要<span class="integral">{{ attachment.integral }}</span>积分</span>
                        <span class="space">已下载{{ attachment.downloadCount }}次</span>
                        <el-button type="primary" size="small" @click="handleDownLoad">下载</el-button>
                    </div>
                </div>
                <div class="comment-info" id="comment-box">
                    <CommentCmp :articleId="articleId" @commitComment="commitComment" />
                </div>
            </div>
            <div class="right" :style="{ transform: `translateY(${top}px)` }">
                <div class="menu-title">目录</div>
                <div class="menu-list">
                    <template v-if="menuArr.length">
                        <div :class="['menu-item']" @click="titleJump(menu.id)"
                            :style="{ paddingLeft: `${menu.level * 10}px` }" v-for="menu in menuArr" :key="menu.id">
                            {{ menu.text }}
                        </div>
                    </template>
                    <template v-else>
                        <div class="not-menu">暂无目录信息</div>
                    </template>
                </div>
            </div>
        </div>
        <div class="article-options" :style="{ transform: `translateY(${top}px)` }">
            <div class="option-item" @click="handlePraise">
                <el-badge :value="forumArticle.goodCount" :hidden="!forumArticle.goodCount">
                    <i :class="['iconfont', 'icon-good', haveLike ? 'option-active' : '']"></i>
                </el-badge>
            </div>
            <div class="option-item" @click="hashJump('comment-box')">
                <el-badge :value="forumArticle.commentCount" :hidden="!forumArticle.commentCount">
                    <i class="iconfont icon-comment"></i>
                </el-badge>
            </div>
            <div class="option-item" @click="hashJump('file-box')">
                <i class="iconfont icon-attachment"></i>
            </div>
        </div>
        <ImagePreview :urlList="urlList" :showIdx="showIdx" :show="showImg" @closeImg="closeImg" />
    </div>
</template>

<script setup>
import { ref, reactive, inject, toRefs, getCurrentInstance, provide, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowRight } from '@element-plus/icons-vue'
import { Confirm } from '@/utils/Confirm.js'
import PreviewHtml from '@/components/PreviewHtml.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import CommentCmp from './components/CommentCmp.vue'


import { getArticleDetail, doLike, getUserDownloadInfo } from '@/api/article.js'
import { sizeTranslate } from '@/utils/commonFn.js'
import { scrollTopChangeHook } from '@/utils/hooks.js'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import settings from '@/utils/settings.js'
const { proxy } = getCurrentInstance()
const { top } = scrollTopChangeHook()

const userInfoStore = useUserInfoStore()
const loginSettingStore = useLoginSettingStore()
const pagePxStore = inject('pagePxStore')
const { mainWidth } = storeToRefs(pagePxStore)
const { userId } = storeToRefs(userInfoStore)
const globalInfo = inject('globalInfo')

const route = useRoute()
const articleId = ref(route.params.articleId)

const articleData = reactive({
    haveLike: false,
    forumArticle: {},
    attachment: null,
})
const { forumArticle, attachment, haveLike } = toRefs(articleData)
provide('forumArticle', forumArticle)
// 获取文章信息
const getArticle = async () => {
    const result = await getArticleDetail({
        articleId: articleId.value
    })
    if (!result) {
        return
    }
    Object.assign(articleData, result.data)
}

// hash跳转
const hashJump = (id) => {
    document.location.hash = '#' + id
}
// 处理点赞
const handlePraise = () => {
    if (userId.value) {
        praiseArticle({
            articleId: articleId.value
        })
    } else {
        proxy.Message.warning('请先登录')
        // 弹出登录框
        loginSettingStore.title = settings.loginFormTitle.login
        loginSettingStore.show = true
    }
}
// 点赞
const praiseArticle = async (params) => {
    const result = await doLike(params)
    if (!result) {
        return
    }
    if (articleData.haveLike) {
        // 取消点赞
        articleData.haveLike = false;
        articleData.forumArticle.goodCount--
    } else {
        // 点赞成功
        articleData.haveLike = true;
        articleData.forumArticle.goodCount++
    }
}

// 处理下载
const userDownloadInfo = reactive({
    haveDownload: false,
    userIntegral: 0,
})
const handleDownLoad = async () => {
    // 获取用户积分
    await getPoint()
    // 下载所需积分为0或者是资源提供者或者曾下载过该附件，直接下载
    if (attachment.value.integral === 0 || forumArticle.value.userId === userId.value || userDownloadInfo.haveDownload) {
        downLoad()
        return
    }
    Confirm(`您当前还有${userDownloadInfo.userIntegral}积分，下载该附件需要${attachment.value.integral}积分，确定下载？`, '下载', async () => {
        // 判断积分
        if (userDownloadInfo.userIntegral < attachment.value.integral) {
            // 积分不足且不是资源提供人 不给下载
            proxy.Message.warning('积分不足，无法下载')
            return
        }
        // 下载附件
        downLoad()
    })
}
// 获取用户下载信息
const getPoint = async () => {
    const result = await getUserDownloadInfo({
        fileId: attachment.value.fileId
    })
    if (!result) {
        return
    }
    Object.assign(userDownloadInfo, result.data)
}
// 下载附件
const downLoad = () => {
    window.open(`${globalInfo.attachmentDownloadUrl}?fileId=${attachment.value.fileId}`)
    articleData.attachment.downloadCount++

}

// 评论数量变动
const commitComment = (number) => {
    articleData.forumArticle.commentCount = number
}

// 内容处理
const urlList = reactive([]) //图片url
const showImg = ref(false) //是否放大图片
const showIdx = ref(null) //显示索引
const menuArr = reactive([]) //目录
const previewClick = (e) => {
    if (e.target.tagName === 'IMG') {
        // 获取图片url集合
        showIdx.value = urlList.findIndex(el => {
            return el === e.target.getAttribute('data-url')
        })
        // 放大图片
        showImg.value = true
    }
}
const closeImg = () => {
    showImg.value = false
    showIdx.value = null
}
// 文章内容加载完成
const htmlLoad = (menu, imgs) => {
    Object.assign(menuArr, menu)
    Object.assign(urlList, imgs)
}
// 目录锚点跳转
const titleJump = (id) => {
    document.location.hash = '#' + id
}

const init = async () => {
    await getArticle()
}
init()
</script>

<style lang="scss" scoped>
.article-detail {
    position: relative;

    .article-options {
        position: absolute;
        height: 180px;
        width: 40px;
        top: 100px;
        left: -80px;
        // background-color: #fff;

        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;

        .option-item {
            background-color: #fff;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;

            &:hover {
                background-color: #ddd;
            }

            i {
                font-size: 26px;
            }

            &:deep(.el-badge) {
                .el-badge__content.is-fixed {
                    top: -4px;
                    right: 4px;
                }
            }
        }

        .option-active {
            color: $color-blue;
        }
    }

    .breadcrumb-box {
        margin-bottom: 10px;
    }

    .page-content {
        display: flex;
        justify-content: flex-start;

        .left {
            width: calc(100% - 300px);
            margin-right: 10px;

            .article-info {

                padding: 10px 10px 0px;

                .article-title {
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 40px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    .top-tag {
                        margin-left: 8px;
                    }
                }

                .author-info {
                    border-bottom: 1px solid #ddd;
                    padding: 6px 0;
                    display: flex;
                    justify-content: flex-start;

                    .author-left {
                        margin-right: 10px;
                    }

                    .author-right {
                        color: $color-font;

                        .nickname {
                            &:hover {
                                color: $color-blue;
                            }
                        }

                        .other-info {
                            margin-top: 6px;
                            font-size: 14px;

                            .dot {
                                margin: 0 6px;
                            }

                            .iconfont {
                                margin-left: 10px;
                                margin-right: 4px;
                            }

                            .edit {
                                font-size: 14px;

                                .iconfont {
                                    margin-right: 2px;
                                }
                            }
                        }
                    }
                }
            }

            .file-info {
                margin-top: 20px;
                padding: 20px;
                font-size: 18px;

                .info-box {
                    margin-top: 10px;
                    font-size: 14px;
                    color: $color-font;

                    .file-name {
                        color: $color-blue;
                    }

                    .space {
                        margin: 0 10px;
                    }

                    .integral {
                        color: orangered;
                        margin: 0 4px;
                    }
                }
            }

            .comment-info {
                margin-top: 20px;
            }

            .article-info,
            .comment-info,
            .file-info {
                border-radius: 5px;
                background-color: #fff;
            }
        }

        .right {
            width: 290px;
            height: max-content;
            max-height: calc(100vh - 300px);
            background-color: #fff;
            border-radius: 5px;
            overflow: auto;

            .menu-title {
                font-size: 16px;
                font-weight: bold;
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }

            .menu-list {
                padding: 5px;

                .menu-item {
                    padding: 5px 0;
                    cursor: pointer;
                    border-left: 2px solid #fff;
                    font-size: 16px;
                    font-weight: bold;

                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &:hover {
                        background-color: #efebeb;
                        // border-left: 2px solid $color-blue;
                    }
                }

                .menu-active {
                    background-color: #efebeb;
                    // border-left: 2px solid $color-blue;
                }

                .not-menu{
                    text-align: center;
                    padding: 10px;
                    color: $color-font;
                }
            }
        }
    }
}
</style>