<template>
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :show-close="dialogConfig.showClose" @close="dialogClose"
        :buttons="dialogConfig.buttons" width="400px">
        <template v-if="dialogConfig.show">
            <component :is="dom[currentOption]" @change="change" @closeForm="dialogClose" ref="com" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref,watch } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import UpdatePwdForm from './UpdatePwdForm.vue'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import settings from '@/utils/settings.js'
// 当前显示的表单组件
const currentOption = ref('login')
const com = ref(null)
// 表单组件
const dom = {
    login: LoginForm,
    register: RegisterForm,
    update: UpdatePwdForm,
}
// 表单标题
const formTitle = settings.loginFormTitle

// 弹窗配置
const dialogConfig = useLoginSettingStore()
const dialogClose = () => {
    dialogConfig.show = false
}
// 切换表单
const change = (name) => {
    dialogConfig.title = formTitle[name]
}

// 监听标题的变化来切换组件
watch(()=>dialogConfig.title,(newV)=>{
    if (newV===formTitle.login) {
        currentOption.value = 'login'
    }else if(newV===formTitle.register){
        currentOption.value = 'register'
    }else if(newV===formTitle.update){
        currentOption.value = 'update'
    }
})
</script>

<style lang="scss" scoped></style>