<template>
    <div class="article-page" :style="{ width: `${mainWidth}px` }">
        <div class="sub-board">
            <router-link :to="`/articleList/${articleType.pBoardId}`">
                <el-tag effect="plain" :class="['normal-tag', !articleType.boardId ? 'tag-active' : '']" round>
                    全部
                </el-tag>
            </router-link>
            <template v-if="getChildBoardById(articleType.pBoardId).length">
                <router-link v-for="item in getChildBoardById(articleType.pBoardId)" :key="item.boardId"
                    :to="`/articleList/${item.pBoardId}/${item.boardId}`">
                    <el-tag effect="plain" :class="['normal-tag', articleType.boardId == item.boardId ? 'tag-active' : '']"
                        round>
                        {{ item.boardName }}
                    </el-tag>
                </router-link>
            </template>
        </div>
        <div class="article-part">
            <el-tabs v-model="articleType.orderType" @tab-click="tabChange">
                <el-tab-pane :label="'热榜'" :name="0" />
                <el-tab-pane :label="'发布时间'" :name="1" />
                <el-tab-pane :label="'最新'" :name="2" />
            </el-tabs>
            <ArticleList :loading="loading" :dataSource="article" :description="'暂无帖子'" @pageChange="pageChange" />
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { loadArticle } from '@/api/article.js'
import { reactive, ref, watch, inject } from 'vue';
import { useRoute } from 'vue-router'
import { useBoardInfoStore } from '@/stores/board.js'


const route = useRoute()

// 文章类型
const articleType = reactive({
    pBoardId: route.params.pBoardId || null,
    boardId: route.params.boardId || 0,//0默认全部
    orderType: 0,//0热门 1发布时间 2最新发布
    pageNo: 1,
})

const pagePxStore = inject('pagePxStore')
const { mainWidth } = storeToRefs(pagePxStore)

const boardInfoStore = useBoardInfoStore()
const { getChildBoardById } = storeToRefs(boardInfoStore)

const article = reactive({
    list: [],
    pageNo: 1,
    pageSize: 15,
    pageTotal: 0,
    totalCount: 0,
})
// 获取文章列表
const loading = ref(false)
const getArticleList = async () => {
    loading.value = true
    const params = Object.assign({}, articleType)
    const result = await loadArticle(params, false)
    if (!result) {
        return
    }
    Object.assign(article, result.data)
    loading.value = false
}

// 分页变化
const pageChange = async (e) => {
    articleType.pageNo = e
    await getArticleList()
}

// 类型变化
const tabChange = (tab,e)=>{
    articleType.orderType = tab.paneName
    articleType.pageNo = 1
    getArticleList()
}

watch(() => route.params, (newValue) => {
    // 页面跳转不属于文章列表，终结方法的执行
    if (!route.path.includes('/articleList') && route.path !== '/') {
        return
    }
    let newV = {}
    if (!Object.keys(newValue).length) {
        newV = { orderType: 0, pageNo: 1, pBoardId: null, boardId: 0 }
    } else {
        newV = newValue
    }
    const newObj = Object.assign({ orderType: 0, pageNo: 1, boardId: null }, newV)
    Object.assign(articleType, newObj)
    // 获取文章列表
    getArticleList()
})

getArticleList()
</script>

<style lang="scss" scoped>
.article-page {
    .sub-board {
        margin-bottom: 10px;

        .el-tag {
            margin-right: 10px;

        }
    }

    .article-part {
        background-color: #fff;
        padding: 0 10px 10px;
    }


}
</style>