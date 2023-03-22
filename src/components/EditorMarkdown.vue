<template>
    <v-md-editor :model-value="modelValue" :height="height+'px'" :disabled-menus="[]" :include-level="[1, 2, 3, 4, 5, 6]"
        @upload-image="handleUploadImg" @change="change"></v-md-editor>
</template>

<script setup>
import { inject } from 'vue'
import { uploadImg } from '@/api/article.js'
// markdown编辑器主题
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';// 引入使用主题的样式
// markdown编辑器
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import hljs from '@/utils/hljs.js';
VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
const globalInfo = inject('globalInfo')
const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    height: {
        type: Number,
        default: 500,
    }
})

const handleUploadImg = async (event, insertImg, files) => {
    const result = await uploadImg({
        file: files[0]
    })
    if (!result) {
        return
    }
    const url = globalInfo.getImageUrl + '/' + result.data.fileName
    insertImg({url,desc:"图片"})
}
const emit = defineEmits(['update:modelValue', 'htmlContent'])
const change = (md, html) => {
    emit('update:modelValue', md)
    emit('htmlContent', html)
}
</script>

<style lang="scss" scoped></style>