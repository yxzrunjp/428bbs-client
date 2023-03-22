<template>
    <div class="search-page" :style="{ width: `${mainWidth}px` }">
        <div class="search-wrap">
            <el-input :size="'large'" clearable @change="inputChange" @keyup.enter="handleSearch" placeholder="请输入搜索关键字"
                v-model="keyword">
                <template #prefix>
                    <i class="iconfont icon-search"></i>
                </template>
            </el-input>
        </div>
        <ArticleList :imgSize="400" :loading="loading" :dataSource="article" :description="'暂无帖子'" @pageChange="pageChange" />
    </div>
</template>

<script setup>
import { ref, reactive, inject, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { searchArticle } from '@/api/article.js'

const { proxy } = getCurrentInstance()
const pagePxStore = inject('pagePxStore')
const { mainWidth } = storeToRefs(pagePxStore)

const article = reactive({
    totalCount: 0,
    pageSize: 15,
    pageNo: 1,
    pageTotal: 0,
    list: [],
})
const keyword = ref('')
const handleSearch = () => {
    const value = keyword.value.trim()
    if (!value || value.length < 3) {
        proxy.Message.warning('请输入三字以上的关键字')
        return
    }
    search()
}
const pageChange = (e) => {
    article.pageNo = e
    search()
}
const inputChange = (e) => {
    if (!e) {
        resetArticle()
    }
}
const resetArticle = () => {
    Object.assign(article, {
        totalCount: 0,
        pageSize: 15,
        pageNo: 1,
        pageTotal: 0,
        list: [],
    })
}

const loading = ref(false)
const search = async () => {
    loading.value = true
    const params = {}
    params.pageNo = article.pageNo
    params.keyword = keyword.value.trim()
    const result = await searchArticle(params)
    if (!result) {
        return
    }
    const data = result.data
    data.list.forEach(el => {
        const word = keyword.value.trim()
        el.title = el.title.replace(word, '<span style="color:#ff4757">' + word + '</span>')
    })
    Object.assign(article, data)
    loading.value = false
}
</script>

<style lang="scss" scoped>
.search-page {
    border-radius: 5px;
    height: 100%;
    background-color: #fff;
    padding: 10px;

    .search-wrap {
        width: 700px;
        height: 50px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &:deep(.article-list) {
        .el-empty {
            .el-empty__description {
                p {
                    font-size: 30px;
                }
            }
        }
    }
}
</style>