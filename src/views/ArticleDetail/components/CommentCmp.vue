<template>
    <div class="comment-cmp">
        <div class="title-part">
            <div class="title">评论<span class="comment-count">{{ commentData.totalCount }}</span></div>
            <div class="sort-btns">
                <span :class="['text-btn', orderType === '0' ? 'text-btn-active' : '']" @click="handleSort('0')">热评</span>
                <el-divider direction="vertical"></el-divider>
                <span :class="['text-btn', orderType === '1' ? 'text-btn-active' : '']" @click="handleSort('1')">最新</span>
            </div>
        </div>
        <CommentInput :showOptions="!!userId" :userId="userId" @commitFinish="commitFinish" />
        <div class="comment-part">
            <template v-if="commentData.totalCount">
                <CommentItem v-for="item in commentData.list" :data="item" :key="item.commentId"
                    :showCommentId="showCommentId" @reply="handleReply" @commitFinish="commitFinish"
                    @reLoadData="getComment" />
            </template>
            <template v-else>
                <el-empty description="暂无评论" :image-size="100" />
            </template>
        </div>
        <div class="pagination" v-if="commentData.totalCount">
            <el-pagination background layout="prev, pager, next" :total="commentData.totalCount"
                :page-size="commentData.pageSize" :current-page="commentData.pageNo" @current-change="pageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { loadComment } from '@/api/comment.js'
import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo.js'

import CommentItem from './CommentItem.vue'
import CommentInput from './CommentInput.vue';

const props = defineProps({
    articleId: {
        type: String,
        default: '',
    }
})

// 获取登录的用户ID
const userInfoStore = useUserInfoStore()
const { userId } = storeToRefs(userInfoStore)

// 变更评论排序
const orderType = ref('0')//0:根据火热程度排序 1:根据时间倒序排
const handleSort = (type) => {
    orderType.value = type
    // 更改请求页，重新获取评论
    commentData.pageNo = 1
    getComment()
}
// 分页变化
const pageChange = async (e) => {
    commentData.pageNo = e
    await getComment()
}

// 获取评论
const commentData = reactive({
    totalCount: 0,
    pageSize: 50,
    pageNo: 1,
    pageTotal: 0,
    list: [],
})
const getComment = async () => {
    const result = await loadComment({
        articleId: props.articleId,
        pageNo: commentData.pageNo,
        orderType: orderType.value,
    })
    if (!result) {
        return
    }
    Object.assign(commentData, result.data)
}

// 回复
const showCommentId = ref(null)
const handleReply = (id) => {
    showCommentId.value = id
}
const emit = defineEmits(['commitComment'])
const commitFinish = async () => {
    handleReply(null)
    await getComment()
    emit('commitComment', commentData.totalCount)
}


const init = async () => {
    await getComment()
}
init()

</script>

<style lang="scss" scoped>
.comment-cmp {
    width: 100%;
    padding: 20px;

    .title-part {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .title {
            margin-right: 20px;
            font-size: 18px;
            font-weight: bold;

            .comment-count {
                margin-left: 10px;
                font-size: 16px;
                vertical-align: bottom;
                color: $color-font;
            }
        }
    }



    .comment-part {
        margin-top: 10px;
        .el-empty{
            padding: 10px 0;
        }
    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 10px;
        height: 40px;
    }
}
</style>