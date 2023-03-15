<template>
    <div class="user-page">
        {{ userId }}
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue'
const route = useRoute()
const userId = ref(route.params.userId)
</script>

<style lang="scss" scoped>
.user-page {}
</style>