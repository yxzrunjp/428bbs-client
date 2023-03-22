import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// cookies
import VueCookies from 'vue-cookies'

import '@/assets/scss/reset.scss'
import '@/assets/icon/iconfont.css'

// 全局组件
import Dialog from '@/components/Dialog.vue'
import Avatar from '@/components/Avatar.vue'
import ArticleItem from '@/components/ArticleItem.vue'
import ArticleList from '@/components/ArticleList.vue'
import Cover from '@/components/Cover.vue'

// 正则验证
import verify from '@/utils/verify.js'
import Message from '@/utils/Message.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('Dialog', Dialog)
app.component('Avatar', Avatar)
app.component('ArticleItem', ArticleItem)
app.component('ArticleList', ArticleList)
app.component('Cover', Cover)

app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.verify = verify
app.config.globalProperties.Message = Message

app.mount('#app')