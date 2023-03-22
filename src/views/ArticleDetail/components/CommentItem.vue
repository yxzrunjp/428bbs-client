<template>
    <div class="comment-item">
        <div class="left">
            <Avatar :userId="data.userId" :size="50"></Avatar>
        </div>
        <div class="right">
            <router-link :to="`/user/${data.userId}`">
                <div class="nickname-wrap">
                    <span class="nickname">{{ data.nickName }}</span>
                    <span class="author-tag" v-if="data.userId === forumArticle.userId">作者</span>
                </div>
            </router-link>
            <div class="comment-content">
                <div class="content-box">
                    <el-tag v-if="data.topType" :size="'small'" effect="plain" class="top-tag">置顶</el-tag>
                    <el-tag v-if="data.status === 0" :size="'small'" type="warning" effect="plain" class="top-tag">待审核</el-tag>
                    <div class="content">{{ data.content }}</div>
                </div>
                <div class="content-img" v-if="data.imgPath">
                    <CommentImage :src="`${globalInfo.getImageUrl}/${data.imgPath.replace('.', '_.')}`"
                        :srcList="[`${globalInfo.getImageUrl}/${data.imgPath}`]" />
                </div>
            </div>
            <div class="other-info">
                <span>{{ data.postTime }}</span>
                <span class="space">·</span>
                <span>{{ data.userIpAddress }}</span>
                <span :class="['option', 'space', data.likeType === 1 ? 'option-active' : '']"
                    @click="handleLike(data.commentId, data.likeType)"><i class="iconfont icon-good"></i>{{
                        data.goodCount > 0 ? data.goodCount : '点赞' }}</span>
                <span class="option" @click="handleComment(data.userId, data.nickName)"><i
                        class="iconfont icon-comment"></i>回复</span>
                <el-dropdown v-if="userId === forumArticle.userId">
                    <span class="option space">
                        <i class="iconfont icon-more"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleTop(data.commentId, data.topType)">{{ data.topType === 0 ?
                                '设置置顶'
                                : '取消置顶'
                            }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="child-comment-wrap">
                <div class="child-comment" v-for="child in data.children" :key="child.commentId">
                    <div class="child-left">
                        <Avatar :userId="child.userId" :size="30"></Avatar>
                    </div>
                    <div class="child-right">
                        <div class="top">
                            <router-link :to="`/user/${child.userId}`">
                                <div class="nickname-wrap">
                                    <span class="nickname">{{ data.nickName }}</span>
                                    <span class="author-tag" v-if="data.userId === forumArticle.userId">作者</span>
                                </div>
                            </router-link>
                            <span class="space">回复</span>
                            <router-link :to="`/user/${child.userId}`">
                                <span class="reply-obj">@{{ child.nickName }}：</span>
                            </router-link>
                            <div>{{ child.content }}</div>
                        </div>
                        <div class="other-info">
                            <span>{{ child.postTime }}</span>
                            <span class="space">·</span>
                            <span>{{ child.userIpAddress }}</span>
                            <span :class="['option', 'space', child.likeType === 1 ? 'option-active' : '']"
                                @click="handleLike(child.commentId, child.likeType)">
                                <i class="iconfont icon-good"></i>
                                {{
                                    child.goodCount > 0 ? child.goodCount : '点赞' }}
                            </span>
                            <span class="option" @click="handleComment(child.userId, child.nickName)">
                                <i class="iconfont icon-comment"></i>
                                回复
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <CommentInput @commitFinish="commitFinish" v-if="showCommentId === data.commentId" :avatarSize="30"
                :showOptions="false" :pCommentId="data.commentId" :replyUserId="replyUserId" :placeholder="placeholder" />
        </div>
    </div>
</template>

<script setup>
import { inject, ref, watch, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { doLike, changeTopType } from '@/api/comment.js'
import { useCheckLoginHook } from '@/utils/hooks.js'

import CommentImage from './CommentImage.vue'
import CommentInput from './CommentInput.vue';

const { proxy } = getCurrentInstance()

const userInfoStore = useUserInfoStore()
const { userId } = storeToRefs(userInfoStore)

const globalInfo = inject('globalInfo')
const forumArticle = inject('forumArticle')
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    showCommentId: {
        type: Number,
        default: null,
    }
})

const emit = defineEmits(['reply', 'commitFinish', 'reLoadData'])
// 处理点赞
const handleLike = async (commentId, likeType) => {
    // 检查是否登录
    const { isLogin } = useCheckLoginHook()
    if (!isLogin) {
        proxy.Message.warning('请登录')
        return
    }
    commitLike(commentId, likeType)
}
const commitLike = async (commentId, likeType) => {
    const result = await doLike({
        commentId
    })
    if (!result) {
        return
    }
    if (!likeType) {
        proxy.Message.success('点赞成功')
    } else {
        proxy.Message.success('取消成功')
    }
    emit('reLoadData')
}

// 处理回复
const replyUserId = ref('')//回复对象ID
const placeholder = ref('')//回复对象提示
const handleComment = (id, nickName) => {
    // 检查是否登录
    const { isLogin } = useCheckLoginHook()
    if (!isLogin) {
        proxy.Message.warning('请登录')
        return
    }

    if (replyUserId.value === id) {
        // 取消显示回复框
        emit('reply', null)
    } else {
        emit('reply', props.data.commentId)
        replyUserId.value = id
        placeholder.value = `回复 @${nickName}`
    }
}
// 输入完成
const commitFinish = () => {
    emit('commitFinish')
}

watch(() => props.showCommentId, (newV) => {
    if (newV !== props.data.commentId) {
        // 重置回复的属性
        replyUserId.value = ''
        placeholder.value = ''
    }
})
// 处理置顶
const handleTop = (commentId, type) => {
    // 置顶类型 0:取消置顶 1:置顶
    const topType = type === 1 ? 0 : 1;
    changeTop(commentId, topType)

}
const changeTop = async (commentId, topType) => {
    const result = await changeTopType({ commentId, topType })
    if (!result) {
        return
    }
    emit('reLoadData')
}
</script>

<style lang="scss" scoped>
.comment-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px 0 0px;



    .left {
        margin-right: 10px;
    }

    .right {
        flex: 1;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;

        .nickname-wrap {
            display: flex;
            justify-content: flex-start;
            align-items: center;


            .author-tag {
                font-size: 12px;
                border-radius: 4px;
                padding: 2px 4px;
                background-color: $color-blue;
                color: #FFF;
                margin-left: 4px;
            }
        }

        .comment-content {
            margin: 8px 0;

            .content-box {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .top-tag {
                    margin-right: 6px;
                }
            }


            .content-img {
                margin-top: 6px;
            }
        }



        .child-comment-wrap {

            .child-comment {
                padding: 10px 0;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;

                .child-left {
                    margin-right: 10px;
                }

                .child-right {
                    .top {
                        font-size: 14px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        margin-bottom: 6px;

                        .reply-obj {
                            color: $color-blue;
                        }
                    }
                }
            }
        }

        .nickname-wrap,
        .other-info {
            color: $color-font;
            font-size: 14px;

            .option-active {
                color: $color-blue;
            }
        }

        .space {
            margin: 0 8px;
        }

        .other-info {
            i {
                margin-right: 4px;
            }

            .option {
                cursor: pointer;

                &:hover {
                    color: $color-blue;
                }
            }
        }
    }
}
</style>