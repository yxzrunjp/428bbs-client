<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import znCn from 'element-plus/lib/locale/lang/zh-cn'
import { reactive, provide, readonly } from 'vue'
import { usePagePxStore } from '@/stores/pagePx.js'
const pagePxStore = usePagePxStore()
const locale = znCn
const config = reactive({
  max: 1,
})

const globalInfo = readonly({
  avatarUrl: '/api/file/getAvatar',
  getImageUrl:'/api/file/getImage',
  attachmentDownloadUrl:'/api/forum/attachmentDownload',
})

provide('globalInfo', globalInfo)
provide('pagePxStore', pagePxStore)
</script>

<style lang="scss" scoped></style>