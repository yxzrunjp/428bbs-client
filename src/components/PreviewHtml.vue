<template>
    <!-- preview-class="github-markdown-body" -->
    <v-md-preview-html :html="html" preview-class="github-markdown-body" @click="handleClick"></v-md-preview-html>
    <!-- <div v-html="html" @click="handleClick"></div> -->
</template>

<script setup>
// markdown预览组件
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/preview-html.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';// 引入使用主题的样式
import hljs from 'highlight.js';//atom-one-light
// import 'highlight.js/styles/atom-one-light.css'
import { watch, nextTick, reactive } from 'vue';
const props = defineProps({
    html: {
        type: String,
        default: ''
    }
})

// 高亮代码
const highlightCode = () => {
    const all = document.querySelectorAll('pre code')
    all.forEach(el => {
        hljs.highlightElement(el);
    })
}

const imgUrls = reactive([])
// 对图片进行特殊处理
const setImages = () => {
    // 清空图片URL
    imgUrls.splice(0,imgUrls.length)
    const images = document.querySelectorAll('.github-markdown-body p img')
    images.forEach(item => {
        const src = item.getAttribute('src')
        item.setAttribute('data-url', src)
        imgUrls.push(src)
    })
}

watch(() => props.html, () => {
    nextTick(() => {
        // 代码高亮
        highlightCode()
        // 设置懒加载
        setImages()
    })
})

const emit = defineEmits(['click'])
const handleClick = (e) => {
    emit('click', e)
}

defineExpose({
    imgUrls
})


</script>

<style lang="scss" scoped></style>