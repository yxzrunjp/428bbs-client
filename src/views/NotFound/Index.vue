<template>
    <div class="not-found">
        <el-empty description="当前页面不存在" :image-size="400"></el-empty>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.not-found {
    .el-empty {
        &:deep(.el-empty__description) {
            p {
                font-size: 30px;
                color: #ff4757;
            }
        }
    }


}
</style>