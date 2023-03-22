<template>
    <div class="editor-html" style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor :style="{ height: height - 80 + 'px', 'overflow-y': 'hidden' }" :modelValue="modelValue"
            :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @onChange="change" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, shallowRef, inject, getCurrentInstance } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import settings from '@/utils/settings.js'

const loginSettingStore = useLoginSettingStore()
const userInfoStore = useUserInfoStore()
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
// const valueHtml = ref('')
// 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//     }, 1500)
// })
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
// valueHtml.value = props.value
const emit = defineEmits(['update:modelValue'])//htmlChange
const change = (editor) => {
    emit('update:modelValue', editor.getHtml())
}
const toolbarConfig = {
    excludeKeys: ["uploadVideo"],//排除菜单组，写菜单组key的值即可
}

const globalInfo = inject('globalInfo')
const { proxy } = getCurrentInstance()
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            maxFileSize: 3 * 1024 * 1024,
            server: '/api/file/uploadImage',
            fieldName: 'file',
            customInsert(res, insertFn) {
                if (res.code === 200) {
                    const url = globalInfo.getImageUrl + '/' + res.data.fileName
                    insertFn(url, "", "")
                    return
                } else if (res.code === 901) {
                    // 登录超时
                    // 登录过期，重置用户信息
                    userInfoStore.$reset()
                    // 弹出登录框
                    loginSettingStore.title = settings.loginFormTitle.login
                    loginSettingStore.show = true
                    proxy.Message.warning('请登录')
                    return
                }
                proxy.Message.error(res.info)
            }
        }
    }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}



const mode = 'default'//simple
</script>

<style lang="scss" scoped>
.editor-html{
    z-index: 1001;
}
</style>