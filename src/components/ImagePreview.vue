<template>
    <el-image-viewer v-if="show" :urlList="urlList" :initial-index="showIdx" :hide-on-click-modal="true"
        @close="handleClose"></el-image-viewer>
</template>

<script setup>
import { watch } from 'vue'
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
const hiddenScroll = () => {
    document.body.style.overflow = 'hidden'
}
const showScroll = () => {
    document.body.style.overflow = 'auto'
}
watch(()=>props.show,(newV)=>{
    if (newV) {
        hiddenScroll()
    }else{
        showScroll()
    }
})
</script>

<style lang="scss" scoped></style>