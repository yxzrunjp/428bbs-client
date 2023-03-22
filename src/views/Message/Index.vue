<template>
    <div class="msg-page" :style="{ width: `${mainWidth}px` }">
        <div class="breadcrumb-box">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
                <el-breadcrumb-item>消息中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="page-content">
            <el-tabs v-model="code" @tab-click="handleClick">
                <el-tab-pane v-for="item in setting.msgList" :key="item.code" :label="item.label" :name="item.code">
                    <template #label>
                        <div class="custom-tabs-label">
                            <div>{{ item.label }}</div>
                            <div v-if="msgCount[item.code]" class="msg-count">
                                {{ msgCount[item.code] > 99 ? '99+' : msgCount[item.code] }}
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
            <div class="info-list">
                <div class="skeleton">
                    <el-skeleton :rows="2" :loading="loading" animated>
                        <template #default>
                            <template v-if="msgInfo.totalCount">
                                <div class="message-item" v-for="msg in msgInfo.list" :key="msg.messageId">
                                    <!-- 系统消息 -->
                                    <template v-if="msg.messageType === 0">
                                        <div class="sys-msg-wrap">
                                            <div class="sys-msg" v-html="msg.messageContent"></div>
                                            <div class="sys-msg-time">{{ msg.createTime }}</div>
                                        </div>
                                    </template>
                                    <!-- 回复1，点赞回复3 -->
                                    <template v-if="msg.messageType === 1 || msg.messageType === 3">
                                        <div class="reply-msg-wrap">
                                            <div class="msg-left">
                                                <Avatar :userId="msg.sendUserId" :size="40" :link="false" />
                                            </div>
                                            <div class="msg-right">
                                                <div class="msg-from">
                                                    <router-link :to="`/user/${msg.sendUserId}`">
                                                        <span class="text-btn">@{{ msg.sendNickName }}</span>
                                                    </router-link>
                                                    <span class="space">
                                                        {{ msg.messageType === 1 ? '对我的文章' : '在文章' }}
                                                    </span>
                                                    <router-link :to="`/articleDetail/${msg.articleId}`">
                                                        <span class="text-btn">【{{ msg.articleTitle }}】</span>
                                                    </router-link>
                                                    <span class="space">
                                                        {{ msg.messageType === 1 ? '发表了评论' : '中赞了我的评论' }}
                                                    </span>
                                                    <span class="time">{{ msg.createTime }}</span>
                                                </div>
                                                <div class="msg-content">
                                                    {{ msg.messageContent }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <!-- 点赞文章2，下载附件4 -->
                                    <template v-if="msg.messageType === 2 || msg.messageType === 4">
                                        <div class="like-msg-wrap">
                                            <div class="msg-left">
                                                <Avatar :userId="msg.sendUserId" :size="40" :link="false" />
                                            </div>
                                            <div class="msg-right">
                                                <div class="msg-from">
                                                    <router-link :to="`/user/${msg.sendUserId}`">
                                                        <span class="text-btn">@{{ msg.sendNickName }}</span>
                                                    </router-link>
                                                    <span class="space">
                                                        {{ msg.messageType === 2 ? '赞了我的文章' : '在文章' }}
                                                    </span>
                                                    <router-link :to="`/articleDetail/${msg.articleId}`">
                                                        <span class="text-btn">【{{ msg.articleTitle }}】</span>
                                                    </router-link>
                                                    <span class="space">
                                                        {{ msg.messageType === 2 ? '' : '中下载了我的附件' }}
                                                    </span>
                                                    <span class="time">{{ msg.createTime }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                            <template v-else>
                                <el-empty description="暂无消息" />
                            </template>
                        </template>
                    </el-skeleton>
                </div>
            </div>
            <div class="pagination" v-if="msgInfo.totalCount">
                <el-pagination background layout="prev, pager, next" :total="msgInfo.totalCount"
                    :page-size="msgInfo.pageSize" :current-page="msgInfo.pageNo" @current-change="pageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from '@/components/Avatar.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { inject, ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo.js'
import setting from '@/utils/settings.js'
import { loadMessageList } from '@/api/user.js'

const pagePxStore = inject('pagePxStore')
const userInfoStore = useUserInfoStore()
const { mainWidth } = storeToRefs(pagePxStore)
const { msgCount } = storeToRefs(userInfoStore)

const route = useRoute()
const code = ref(route.params.code || setting.msgList[0].label)
const handleClick = async (tab, e) => {
    code.value = tab.paneName
    msgInfo.pageNo = 1
    // 获取数据
    await getMsgInfo()
    // 重置消息数量
    userInfoStore.setMsgCount(code.value)
}

const msgInfo = reactive({
    totalCount: 0,
    pageSize: 50,
    pageNo: 1,
    pageTotal: 0,
    list: [],
})
// 页面切换
const pageChange = (e) => {
    msgInfo.pageNo = e
    getMsgInfo()
}
// 获取信息列表
const loading = ref(false)
const getMsgInfo = async () => {
    loading.value = true
    const params = {}
    params.pageNo = msgInfo.pageNo
    params.code = code.value
    const result = await loadMessageList(params)
    if (!result) {
        return
    }
    Object.assign(msgInfo, result.data)
    loading.value = false
}

watch(() => route.params, (newV) => {
    if (!route.path.includes('/message')) {
        return
    }
    code.value = newV.code
    // 获取数据
    getMsgInfo()
    // 重置消息数量
    userInfoStore.setMsgCount(code.value)
})

const init = async () => {
    // 获取数据
    await getMsgInfo()
    // 重置消息数量
    userInfoStore.setMsgCount(code.value)
}
init()
</script>

<style lang="scss" scoped>
.msg-page {
    .breadcrumb-box {
        margin-bottom: 10px;
    }

    .page-content {
        background-color: #fff;
        width: 100%;
        padding: 10px;
        border-radius: 5px;

        .custom-tabs-label {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .msg-count {
                margin-left: 6px;
            }
        }

        .info-list {
            .message-item {
                padding: 10px 0;
                border-bottom: 1px solid $color-font;

                .space {
                    margin: 0 4px;
                }

                .sys-msg-wrap {
                    font-size: 14px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    .sys-msg {
                        margin-right: 10px;
                    }

                    .sys-msg-time {
                        color: $color-font;
                    }
                }

                .reply-msg-wrap {
                    display: flex;
                    justify-content: flex-start;

                    .msg-right {

                        .msg-content {
                            color: $color-font;
                            font-size: 16px;
                            margin-top: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }

                .like-msg-wrap {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }

                .msg-left {
                    margin-right: 10px;
                }

                .msg-right {
                    font-size: 14px;

                    .time {
                        color: $color-font;
                    }
                }
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
}
</style>