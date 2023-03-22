<template>
    <div class="article-list">
        <div class="skeleton">
            <el-skeleton :rows="3" :loading="loading" animated>
                <template #default>
                    <template v-if="dataSource.totalCount">
                        <ArticleItem :showEdit="showEdit" :data="item" v-for="item in dataSource.list"
                            :key="item.articleId" />
                    </template>
                    <template v-else>
                        <el-empty :description="description" :image-size="imgSize" />
                    </template>
                </template>
            </el-skeleton>
        </div>
    </div>
    <div class="pagination" v-if="dataSource.totalCount">
        <el-pagination background layout="prev, pager, next" :total="dataSource.totalCount" :page-size="dataSource.pageSize"
            :current-page="dataSource.pageNo" @current-change="pageChange" />
    </div>
</template>

<script setup>
const emit = defineEmits(['pageChange'])
const props = defineProps({
    dataSource: {
        type: Object,
        default: () => {
            return {
                list: [],
                pageNo: 1,
                pageSize: 15,
                pageTotal: 0,
                totalCount: 0,
            }
        }
    },
    loading: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        default: '暂无内容',
    },
    showEdit: {
        type: Boolean,
        default: false,
    },
    imgSize: {
        type: Number,
        default: 200,
    }
})
const pageChange = (e) => {
    emit('pageChange', e)
}
</script>

<style lang="scss" scoped>
.article-list {
    &:deep(.el-empty) {
        .el-empty__description {
            p {
                font-size: 20px;
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
</style>