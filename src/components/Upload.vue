<template>
    <el-upload name="file" 
        :multiple="false" 
        :accept="accept.join(',')" 
        :http-request="handleUpload"
        :show-file-list="false">
        <slot></slot>
    </el-upload>
</template>

<script setup>
import { ref } from 'vue'
const accept = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG', '.gif', '.GIF', '.bmp', '.BMP']
const props = defineProps({
    modelValue:{
        type:Object,
        default:null,
    }
})
const emit = defineEmits(['upload','update:modelValue'])
const src = ref('')

const handleUpload = ({ file }) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = ({target}) => {
        emit('upload',file,target.result)
        emit('update:modelValue',file)
    }
}
</script>

<style lang="scss" scoped></style>