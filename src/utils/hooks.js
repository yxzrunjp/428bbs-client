import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePagePxStore } from '@/stores/pagePx.js'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import settings from '@/utils/settings.js'


const userInfoStore = useUserInfoStore()
const loginSettingStore = useLoginSettingStore()
const pagePxStore = usePagePxStore()

export const useScrollHiddenHook = () => {
    const isHidden = ref(false)
    const scrollTop = ref(0)
    const getScrollTop = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        return scrollTop
    }
    const handleScroll = () => {
        const currentScrollTop = getScrollTop()

        if (currentScrollTop > scrollTop.value) {
            // 向下滚动时，元素未隐藏的情况下且滚动距离超过页头部分，将元素隐藏
            if (!isHidden.value && currentScrollTop > pagePxStore.headerHeightPlusSpace) {
                isHidden.value = true
            }
        } else {
            // 向上滚动时，元素当前未显示时，则将元素显示
            if (isHidden.value) {
                isHidden.value = false
            }
        }
        // 重新赋值
        scrollTop.value = currentScrollTop
    }

    onMounted(() => {
        scrollTop.value = getScrollTop()
        document.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('scroll', handleScroll)
    })
    return {
        isHidden
    }
}

export const scrollTopChangeHook = () => {
    let top = ref(document.documentElement.scrollTop || document.body.scrollTop)
    const scrollTopChange = () => {
        top.value = document.documentElement.scrollTop || document.body.scrollTop
    }
    onMounted(() => {
        document.addEventListener('scroll', scrollTopChange)
    })
    onBeforeUnmount(() => {
        document.removeEventListener('scroll', scrollTopChange)
    })
    return {
        top
    }
}

// 验证登录
export const useCheckLoginHook = () => {
    let isLogin = false;
    if (!userInfoStore.userId) {
        // 提示登录
        loginSettingStore.show = true
        loginSettingStore.title = settings.loginFormTitle.login
        isLogin =  false
    }else{
        isLogin =  true
    }
    return {
        isLogin
    }
}