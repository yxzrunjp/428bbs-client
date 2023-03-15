<template>
    <el-image loading="lazy" hide-on-click-modal style="width: 80px; height: 80px" :src="src" :zoom-rate="1.2"
        :preview-src-list="srcList" fit="cover" />
        <!-- :initial-index="4" -->
</template>

<script setup>
const props = defineProps({
    src: {
        type: String,
        default: '',
    },
    srcList: {
        type: Array,
        default: () => {
            return []
        }
    }
})


</script>

<style lang="scss" scoped>
</style>