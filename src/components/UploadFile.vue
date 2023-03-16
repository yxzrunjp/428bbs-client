<template>
    <div class="upload-file">
        <template v-if="modelValue">
            <div class="file-info">
                <div class="file-name">{{ modelValue.name }}</div>
                <div class="file-remove" @click="removeFile">
                    <i class="iconfont icon-del"></i>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="upload-btn">
                <el-upload name="file" :multiple="false" :accept="accept.join(',')" :http-request="handleUpload"
                    :show-file-list="false">
                    <el-button type="primary" plain>上传</el-button>
                </el-upload>
                <span class="tip">仅支持zip/rar类型的文件</span>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const accept = ['.zip', '.ZIP', '.rar', '.RAR']
const props = defineProps({
    modelValue: {
        type: Object,
        default: null,
    }
})
const emit = defineEmits(['update:modelValue'])
const src = ref('')

const handleUpload = ({ file }) => {
    emit('update:modelValue', file)
}
const removeFile = () => {
    emit('update:modelValue', null)
}
</script>

<style lang="scss" scoped>
.upload-file {
    width: 100%;

    .file-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;

        .file-name {
            width: calc(100% - 30px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .file-remove {
            width: 20px;
            margin-left: 10px;
            cursor: pointer;
            color: $color-font;

            &:hover {
                color: $color-blue;
            }
        }
    }
    .upload-btn{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tip{
            margin-left: 10px;
            font-size: 12px;
            color: $color-font;
        }
    }
}
</style>