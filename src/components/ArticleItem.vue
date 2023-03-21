<template>
    <div class="article-item">

        <div class="left">
            <div class="user-info">
                <Avatar :userId="data.userId" :size="36" />
                <router-link :to="`/user/${data.userId}`">
                    <div class="nickname">{{ data.nickName }}</div>
                </router-link>

                <el-divider direction="vertical" />
                <span class="time">{{ data.postTime }}</span>
                <span class="dot">·</span>
                <span class="address">{{ data.userIpAddress }}</span>
                <el-divider direction="vertical" />
                <router-link :to="`/articleList/${data.pBoardId}`">
                    <span class="p-board">{{ data.pBoardName }}</span>
                </router-link>
                <template v-if="data.boardName">
                    <span class="division">/</span>
                    <router-link :to="`/articleList/${data.pBoardId}/${data.boardId}`">
                        <span class="board">{{ data.boardName }}</span>
                    </router-link>
                </template>
            </div>
            <div class="center-content">
                <router-link :to="'/articleDetail/' + data.articleId">
                    <div class="title">
                        <el-tag v-if="data.topType" :size="'small'" effect="plain" class="top-tag">置顶</el-tag>
                        <el-tag v-if="data.status===0" :size="'small'" type="warning" effect="plain" class="top-tag">待审核</el-tag>
                        <span>{{ data.title }}</span>
                    </div>
                </router-link>
                <div class="summary">{{ data.summary }}{{ data.summary }}{{ data.summary }}</div>
            </div>
            <div class="options">
                <span class="option-item">
                    <i class="iconfont icon-eye-solid" />
                    <span class="number">{{ data.readCount ? data.readCount : '阅读' }}</span>
                </span>
                <span class="option-item">
                    <i class="iconfont icon-good" />
                    <span class="number">{{ data.goodCount ? data.goodCount : '点赞' }}</span>
                </span>
                <span class="option-item" v-if="sysInfo.commentOpen&&data.status">
                    <i class="iconfont icon-comment" />
                    <span class="number">{{ data.commentCount ? data.commentCount : '评论' }}</span>
                </span>
                <span class="option-item" v-if="showEdit">
                    <router-link class="text-btn" :to="`/article/${data.articleId}`">
                        <i class="iconfont icon-edit" />
                        <span class="number">编辑</span>
                    </router-link>
                </span>
            </div>
        </div>
        <div class="right">
            <Cover v-if="data.cover" :style="{ width: '100%', height: '100%' }" :url="getImageUrl + '/' + data.cover" />
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo';
import { storeToRefs } from 'pinia'
const userInfoStore = useUserInfoStore()
const { sysInfo } = storeToRefs(userInfoStore)
const globalInfo = inject('globalInfo')
const { getImageUrl } = globalInfo
const prop = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    },
    showEdit: {
        type: Boolean,
        default: false,
    }
})
</script>

<style lang="scss" scoped>
.article-item {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid gray;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &:hover {
        background-color: #f7f5f5;
    }

    .left {
        flex: 1;

        .user-info {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 14px;
            color: $color-font;

            .nickname {
                margin-left: 10px;

                &:hover {
                    color: $color-dark-blue;
                }
            }

            .dot,
            .division {
                margin: 0 5px;
            }

            .p-board,
            .board {
                &:hover {
                    color: $color-dark-blue;
                }
            }
        }

        .center-content {
            .title {
                font-size: 16px;
                font-weight: bold;
                height: 24px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                &:hover {
                    color: $color-dark-blue;
                }

                .top-tag {
                    margin-right: 5px;
                }
            }

            .summary {
                margin-top: 10px;
                font-size: 14px;
                color: $color-font;
                line-height: 24px;

                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

            }
        }

        .options {
            margin-top: 10px;

            .option-item {
                margin-right: 10px;
                color: $color-font;

                .number {
                    font-size: 14px;

                    margin-left: 5px;
                }
            }
        }
    }

    .right {
        width: 110px;
        height: 110px;
        margin-left: 10px;
        border-radius: 5px;
        overflow: hidden;
    }

}
</style>