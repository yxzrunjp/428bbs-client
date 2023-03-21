<template>
    <div class="user-page" :style="{ width: `${mainWidth}px` }">
        <div class="breadcrumb-box">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main-content">
            <div class="left">
                <div class="user-info">
                    <div v-if="isLoginUser" @click="handleUpdate" class="text-btn change-btn">修改资料</div>
                    <div class="avatar-wrap">
                        <Avatar :userId="userId" :size="100" :link="false" />
                    </div>
                    <div class="nickname-wrap">
                        <span class="nickname">{{ userInfo.nickName }}</span>
                        <span class="sex">
                            <i class="iconfont icon-woman" v-if="userInfo.sex === 0"></i>
                            <i class="iconfont icon-man" v-else></i>
                        </span>
                    </div>
                    <div class="intro">
                        {{ userInfo.personDescription }}
                    </div>
                </div>
                <div class="other-info">
                    <div class="info-item">
                        <div class="info-name-wrap">
                            <i class="iconfont icon-integral"></i>
                            <span class="info-name">积分</span>
                        </div>
                        <div :class="['info-value', isLoginUser ? 'text-btn' : '']" @click="handleCheckPoint">
                            {{ userInfo.currentIntegral }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-name-wrap">
                            <i class="iconfont icon-like"></i>
                            <span class="info-name">获赞</span>
                        </div>
                        <div class="info-value">
                            {{ userInfo.likeCount }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-name-wrap">
                            <i class="iconfont icon-post"></i>
                            <span class="info-name">发帖</span>
                        </div>
                        <div class="info-value">
                            {{ userInfo.postCount }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-name-wrap">
                            <i class="iconfont icon-register"></i>
                            <span class="info-name">加入</span>
                        </div>
                        <div class="info-value">
                            {{ userInfo.joinTime }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-name-wrap">
                            <i class="iconfont icon-login"></i>
                            <span class="info-name">最后登录</span>
                        </div>
                        <div class="info-value">
                            {{ userInfo.lastLoginTime }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="article-part">
                    <div class="select-part">
                        <span :class="['select-item', type === 0 ? 'select-active' : '']" @click="handleClick(0)">发帖</span>
                        <el-divider direction="vertical" />
                        <span :class="['select-item', type === 1 ? 'select-active' : '']" @click="handleClick(1)">评论</span>
                        <el-divider direction="vertical" />
                        <span :class="['select-item', type === 2 ? 'select-active' : '']" @click="handleClick(2)">点赞</span>
                    </div>
                    <div class="article-list">
                        <div class="skeleton">
                            <el-skeleton :rows="3" :loading="loading" animated>
                                <template #default>
                                    <template v-if="article.totalCount">
                                        <ArticleItem :data="item" v-for="item in article.list" :key="item.articleId" />
                                    </template>
                                    <template v-else>
                                        <el-empty description="暂无帖子" />
                                    </template>
                                </template>
                            </el-skeleton>
                        </div>
                    </div>
                    <div class="pagination" v-if="article.totalCount">
                        <el-pagination background layout="prev, pager, next" :total="article.totalCount"
                            :page-size="article.pageSize" :current-page="article.pageNo" @current-change="pageChange" />
                    </div>
                </div>
            </div>
        </div>
        <EditInfo :data="userInfo" ref="editInfoRef" @submit="handleSubmit" />
        <PointTable ref="pointTableRef" />
    </div>
</template>

<script setup>
import Avatar from '@/components/Avatar.vue'
import ArticleItem from '@/components/ArticleItem.vue'
import EditInfo from './components/EditInfo.vue';
import PointTable from './components/PointTable.vue';

import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { getUserInfo, loadUserArticle } from '@/api/user.js'
import { useUserInfoStore } from '@/stores/userInfo.js'

const pagePxStore = inject('pagePxStore')
const userInfoStore = useUserInfoStore()
const { mainWidth } = storeToRefs(pagePxStore)
const { userId: loginUserId } = storeToRefs(userInfoStore)

const route = useRoute()
const router = useRouter()
const userId = ref(route.params.userId)

const pageNo = ref(1)
const type = ref(0)//0:发帖 1:评论过的文章  2:点赞过的文章
const loading = ref(false)
const article = reactive({
    totalCount: 0,
    pageSize: 15,
    pageNo: 1,
    pageTotal: 0,
    list: [],
})
// 分页变化
const pageChange = async (e) => {
    pageNo.value = e
    await getArticleList()
}
// 标签页切换
const handleClick = (val) => {
    type.value = val
    pageNo.value = 1
    loadArticle()
}
// 获取用户发帖信息
const loadArticle = async () => {
    loading.value = true
    const params = {
        userId: userId.value,
        type: type.value,
        pageNo: pageNo.value
    }
    const result = await loadUserArticle(params)
    if (!result) {
        return
    }
    Object.assign(article, result.data)
    loading.value = false
}

// 当前页面显示的用户信息是否是登录的用户的信息
const isLoginUser = computed(() => {
    return userId.value === loginUserId.value
})

// 获取用户信息
const userInfo = reactive({
    userId: '',
    nickName: '',
    sex: 0,//性别  0:女 1:男
    personDescription: '',
    joinTime: '',
    lastLoginTime: '',
    postCount: '',
    likeCount: '',
    currentIntegral: '',
})
// 通过ID获取用户信息
const getUserInfoById = async () => {
    const result = await getUserInfo({ userId: userId.value })
    if (!result) {
        setTimeout(() => {
            router.go(-1)
        }, 1000)
        return
    }
    Object.assign(userInfo, result.data)

}

// 查看积分来源
const pointTableRef = ref(null)
const handleCheckPoint = () => {
    if (!isLoginUser.value) {
        return
    }
    pointTableRef.value.showDialog()
}


// 修改资料
const editInfoRef = ref(null)
const handleUpdate = () => {
    if (!isLoginUser.value) {
        return
    }
    editInfoRef.value.showDialog()
}
// 数据提交完成，重新获取
const handleSubmit = ()=>{
    getUserInfoById()
}

const init = async () => {
    await getUserInfoById()
    await loadArticle()
}
init()
</script>

<style lang="scss" scoped>
.user-page {

    .breadcrumb-box {
        margin-bottom: 10px;
    }

    .main-content {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;

        .left {
            width: 290px;
            margin-right: 10px;

            .change-btn {
                text-align: right;
                font-size: 14px;
            }

            .user-info {
                padding: 10px;
                text-align: center;

                .avatar-wrap {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .nickname-wrap {
                    margin-top: 10px;

                    .nickname {
                        margin-right: 4px;
                    }

                    .sex {
                        .icon-man {
                            color: rgb(97, 169, 197);
                        }

                        .icon-woman {
                            color: pink;
                        }
                    }
                }

                .intro {
                    font-size: 14px;
                    color: $color-font;
                    margin-top: 10px;
                }

            }

            .other-info {
                padding: 10px;
                margin-top: 10px;

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 14px;

                    &:last-of-type {
                        margin-bottom: 0px;
                    }

                    .info-name-wrap {
                        i {
                            color: $color-font;
                            margin-right: 4px;
                        }

                        .info-name {}
                    }

                    .info-value {}
                }
            }
        }

        .right {
            width: calc(100% - 300px);

            .article-part {
                background-color: #fff;
                padding: 0 10px 10px;

                .select-part {
                    width: 100%;
                    padding: 10px 0;
                    border-bottom: 1px solid gray;

                    .select-item {
                        font-size: 16px;
                        cursor: pointer;

                        &:hover {
                            font-size: 16px;
                            color: $color-dark-blue;
                        }
                    }

                    .select-active {
                        color: $color-dark-blue;
                    }
                }

                .pagination {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin-top: 10px;
                    height: 40px;
                }
            }
        }

        .left>.user-info,
        .left>.other-info,
        .right {
            background-color: #fff;
            border-radius: 5px;
        }
    }
}
</style>