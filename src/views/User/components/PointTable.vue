<template>
    <div class="point-table">
        <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :show-close="dialogConfig.showClose"
            @close="closeDialog" :buttons="dialogConfig.buttons" width="500px">
            <el-form :model="formData" ref="formRef">
                <el-form-item label="日期" prop="time">
                    <el-date-picker v-model="formData.time" type="daterange" range-separator="到" start-placeholder="开始日期"
                        end-placeholder="结束日期" :size="'large'" @change="dateChange" value-format="YYYY-MM-DD" />
                </el-form-item>
            </el-form>
            <div class="content">
                <el-table :data="data.list" :max-height="300">
                    <el-table-column v-for="item in tableColumn" :key="item.prop" :prop="item.prop" :label="item.label"
                        :width="item.width" align="center">
                        <template v-if="item.prop === 'integral'" #default="{ row }">
                            <span :style="{ color: row.integral >= 0 ? '#2ed573' : '#ff4757' }">{{ row.integral }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :total="data.totalCount" :page-size="data.pageSize"
                    :current-page="data.pageNo" @current-change="pageChange" />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { loadUserIntegralRecord } from '@/api/user.js'
const emit = defineEmits(['submit'])


const dialogConfig = reactive({
    show: false,
    title: '积分详细',
    showClose: true,
    buttons: [

    ],
})
const showDialog = () => {
    dialogConfig.show = true
    document.body.style.overflow = 'hidden'
    getData()
}
const closeDialog = () => {
    formData.time = null
    dialogConfig.show = false
    document.body.style.overflow = 'auto'
}

const formData = reactive({
    time: null,
})
const formRef = ref(null)
const dateChange = () => {
    data.pageNo = 1
    getData()
}



// 获取记录
const data = reactive({
    totalCount: 0,
    pageSize: 15,
    pageNo: 1,
    pageTotal: 0,
    list: [],
})
const tableColumn = [
    {
        prop: 'operTypeName',
        label: '类型',
        width: '140',
    },
    {
        prop: 'integral',
        label: '积分',
        width: '100',
    },
    {
        prop: 'createTime',
        label: '时间',
    },
]
const pageChange = (n) => {
    data.pageNo = n
    getData()
}
const getData = async () => {
    const params = {}
    if (formData.time) {
        params.createTimeStart = formData.time[0]
        params.createTimeEnd = formData.time[1]
    }
    params.pageNo = data.pageNo
    const result = await loadUserIntegralRecord(params)
    if (!result) {
        return
    }
    Object.assign(data, result.data)
}


defineExpose({
    showDialog,
})
</script>

<style lang="scss" scoped>
.point-table {
    .pagination {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 40px;
    }
}
</style>