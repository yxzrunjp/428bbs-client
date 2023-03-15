<template>
    <el-image :style="style" :src="url" :fit="fit" />
</template>

<script setup>
const prop = defineProps({
    url:{
        type:String,
        default:'',
    },
    style:{
        type:Object,
        default:()=>{
            return {
                width:'80px',
                height:'80px',
            }
        },
    },
    fit:{
        type:String,
        default:'cover',
    }
})
</script>

<style lang="scss" scoped>

</style>