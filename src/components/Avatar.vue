<template>
    <template v-if="link">
        <RouterLink :to="`/user/${userId}`">
            <el-avatar :size="size" :src="`${avatarUrl}/${userId}`" @error="errorHandler">
                <span v-if="userId">头像</span>
                <span v-else>登录</span>
            </el-avatar>
        </RouterLink>
    </template>
    <template v-else>
        <el-avatar :size="size" :src="`${avatarUrl}/${userId}`" @error="errorHandler">
            <span v-if="userId">头像</span>
            <span class="not-login" v-else>登录</span>
        </el-avatar>
    </template>
</template>

<script setup>
import { inject } from 'vue'
const props = defineProps({
    userId: {
        type: String,
        default: null,
    },
    link: {
        type: Boolean,
        default: true,
    },
    size: {
        type: Number,
        default: 60,
    }
})

const { avatarUrl } = inject('globalInfo')

const errorHandler = (e) => {
}
</script>

<style lang="scss" scoped>

</style>