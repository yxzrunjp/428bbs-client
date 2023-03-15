<template>
    <div class="layout">
        <!-- :style="{ minWidth: `${mainWidth}px` }" -->
        <Transition name="fade">
            <header :style="{ height: headerHeight + 'px' }" v-show="!isHidden">
                <div class="header-content" :style="{ width: mainWidth + 'px' }">
                    <div class="nav">
                        <router-link class="logo" :to="'/'">LOGO</router-link>
                        <router-link :class="['nav-item', currentPath === '/' ? 'active' : '']" :to="'/'"> 首页
                        </router-link>
                        <template v-for="item in boardList" :key="item.boardId">
                            <el-popover v-if="item?.children.length" popper-class="nav-popper" placement="bottom-start"
                                :width="250" trigger="hover">
                                <template #default>
                                    <div class="board-childs">
                                        <router-link :to="`/articleList/${child.pBoardId}/${child.boardId}`"
                                            v-for="child in item.children" :key="child.boardId">
                                            <el-tag round size="large" effect="plain"
                                                :class="['normal-tag', currentPath === `/articleList/${child.pBoardId}/${child.boardId}` ? 'tag-active' : '']">
                                                {{ child.boardName }}
                                            </el-tag>
                                        </router-link>
                                    </div>
                                </template>
                                <template #reference>
                                    <router-link
                                        :class="['nav-item', currentPath.includes(`/articleList/${item.boardId}`) ? 'active' : '']"
                                        :to="`/articleList/${item.boardId}`">{{ item.boardName
                                        }}</router-link>
                                </template>
                            </el-popover>
                            <router-link v-else
                                :class="['nav-item', currentPath.includes(`/articleList/${item.boardId}`) ? 'active' : '']"
                                :to="`/articleList/${item.boardId}`">{{ item.boardName
                                }}</router-link>
                        </template>
                    </div>
                    <div class="header-right">
                        <el-button type="success" @click="handlePublish">发帖<span :style="{ marginLeft: '4px' }"
                                class="iconfont icon-add"></span></el-button>
                        <el-button type="success">搜索<span :style="{ marginLeft: '4px' }"
                                class="iconfont icon-search"></span></el-button>

                        <div class="user-wrap" v-if="userId" :style="{ marginLeft: '10px' }">
                            <el-dropdown>
                                <el-badge :value="12" :max="99" :style="{ cursor: 'pointer' }">
                                    <i class="iconfont icon-message" :style="{ fontSize: '24px' }" />
                                </el-badge>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>回复我的</el-dropdown-item>
                                        <el-dropdown-item>赞了我的文章</el-dropdown-item>
                                        <el-dropdown-item>下载了我的附件</el-dropdown-item>
                                        <el-dropdown-item>赞了我的评论</el-dropdown-item>
                                        <el-dropdown-item>系统消息</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!--  -->
                            <el-dropdown :style="{ marginLeft: '25px' }">
                                <Avatar :size="40" :userId="userId" :link="false" />
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>我的主页</el-dropdown-item>
                                        <el-dropdown-item>退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>

                        </div>
                        <el-button-group v-else :style="{ marginLeft: '10px' }">
                            <el-button type="success" plain @click="handleLoginAndRegister('login')">登录</el-button>
                            <el-button type="success" plain @click="handleLoginAndRegister('register')">注册</el-button>
                        </el-button-group>

                    </div>
                </div>
            </header>
        </Transition>
        <main :style="{ paddingTop: headerHeightPlusSpace + 'px', minHeight: `calc(100vh - ${0}px)` }">
            <RouterView />
        </main>
        <footer></footer>
        <LoginAndRegister />
    </div>
</template>

<script setup>
import { useRoute,useRouter } from 'vue-router'
import { useScrollHiddenHook,useCheckLoginHook } from '@/utils/hooks.js'
import LoginAndRegister from './components/LoginAndRegister.vue';
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import { useBoardInfoStore } from '@/stores/board.js'
import { storeToRefs } from 'pinia'
import { watch, ref, inject,getCurrentInstance } from 'vue'
import settings from '@/utils/settings.js'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const currentPath = ref('')
watch(route, (newV) => {
    currentPath.value = newV.path
}, { immediate: true, deep: true })


const { isHidden } = useScrollHiddenHook()

const userInfoStore = useUserInfoStore()
const pagePxStore = inject('pagePxStore')
const loginSettingStore = useLoginSettingStore()
const boardInfo = useBoardInfoStore()

const { userId } = storeToRefs(userInfoStore)
const { headerHeight, mainWidth, headerHeightPlusSpace } = storeToRefs(pagePxStore)
const { boardList } = storeToRefs(boardInfo)

// 登录注册表单
const handleLoginAndRegister = (type) => {
    loginSettingStore.title = settings.loginFormTitle[type]
    loginSettingStore.show = true
}

// 发帖
const handlePublish = () => {
    const { isLogin } = useCheckLoginHook()
    if(!isLogin){
        // 未登录
        proxy.Message.warning('请登录')
        return
    }
    router.push({path:'/article'})
}

const init = async () => {
    // 获取登录信息
    await userInfoStore.getLoginUserInfo()
    // 获取板块信息
    await boardInfo.getBoardList()
}
init()
</script>

<style lang="scss" scoped>
.layout {
    background-color: $color-main-bg;
    height: max-content;

    header {
        width: 100%;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        background-color: $color-blue;
        box-shadow: 0 0 2px gray;

        .header-content {
            height: 100%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .nav {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .logo {}

                .nav-item {
                    color: $color-nav;
                    font-size: 18px;
                    font-weight: bold;

                    &:hover {
                        color: $color-dark-blue;
                    }
                }

                .active {
                    color: $color-dark-blue !important;
                }

                .logo,
                .nav-item {
                    margin-right: 10px;
                }

            }

            .header-right {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .user-wrap {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
            }
        }
    }

    main {
        margin: 0 auto;
        width: max-content;
    }
}
</style>