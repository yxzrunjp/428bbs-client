<template>
    <el-image-viewer v-if="show" :urlList="urlList" :initial-index="showIdx" :hide-on-click-modal="true"
        @close="handleClose"></el-image-viewer>
</template>

<script setup>
const props = defineProps({
    urlList: {
        type: Array,
        default: () => {
            return []
        }
    },
    show: {
        type: Boolean,
        default: false
    },
    showIdx: {
        type: Number,
        default: null
    }
})
const emit = defineEmits(['closeImg'])
const handleClose = () => {
    emit('closeImg')
}
</script>

<style lang="scss" scoped></style>