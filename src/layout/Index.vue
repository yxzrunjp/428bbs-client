<template>
    <div class="layout" :style="{ minWidth: `${mainWidth}px` }">
        <Transition name="fade">
            <header :style="{ height: headerHeight + 'px' }" v-show="!isHidden">
                <div class="header-content" :style="{ maxWidth: `${mainWidth}px` }">
                    <div class="nav">
                        <router-link class="logo" :to="'/'">
                            <img src="../assets/imgs/cloud.png" alt="logo">
                        </router-link>
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
                        <el-button type="success">
                            <router-link :to="`/search`">
                                搜索<span :style="{ marginLeft: '4px' }" class="iconfont icon-search"></span>
                            </router-link>
                        </el-button>

                        <div class="user-wrap" v-if="userId" :style="{ marginLeft: '10px' }">
                            <el-dropdown>
                                <el-badge :value="msgCount.total" :hidden="!msgCount.total" :max="99"
                                    :style="{ cursor: 'pointer' }">
                                    <i class="iconfont icon-message" :style="{ fontSize: '24px' }" />
                                </el-badge>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <router-link :to="`/message/reply`">
                                            <el-dropdown-item>
                                                <div class="menu-item">
                                                    <div class="menu-name">回复我的</div>
                                                    <div class="msg-count" v-if="msgCount.reply">{{ msgCount.reply > 99 ?
                                                        '99+' : msgCount.reply }}
                                                    </div>
                                                </div>
                                            </el-dropdown-item>
                                        </router-link>
                                        <router-link :to="`/message/likePost`">
                                            <el-dropdown-item>
                                                <div class="menu-item">
                                                    <div class="menu-name">赞了我的文章</div>
                                                    <div class="msg-count" v-if="msgCount.likePost">{{ msgCount.likePost >
                                                        99 ? '99+' : msgCount.likePost
                                                    }}</div>
                                                </div>
                                            </el-dropdown-item>
                                        </router-link>
                                        <router-link :to="`/message/downloadAttachment`">
                                            <el-dropdown-item>
                                                <div class="menu-item">
                                                    <div class="menu-name">下载了我的附件</div>
                                                    <div class="msg-count" v-if="msgCount.downloadAttachment">{{
                                                        msgCount.downloadAttachment > 99 ? '99+' :
                                                        msgCount.downloadAttachment }}
                                                    </div>
                                                </div>
                                            </el-dropdown-item>
                                        </router-link>
                                        <router-link :to="`/message/likeComment`">
                                            <el-dropdown-item>
                                                <div class="menu-item">
                                                    <div class="menu-name">赞了我的评论</div>
                                                    <div class="msg-count" v-if="msgCount.likeComment">{{
                                                        msgCount.likeComment > 99 ? '99+' : msgCount.likeComment }}</div>
                                                </div>
                                            </el-dropdown-item>
                                        </router-link>
                                        <router-link :to="`/message/sys`">
                                            <el-dropdown-item>
                                                <div class="menu-item">
                                                    <div class="menu-name">系统消息</div>
                                                    <div class="msg-count" v-if="msgCount.sys">{{ msgCount.sys > 99 ? '99+'
                                                        : msgCount.sys }}</div>
                                                </div>
                                            </el-dropdown-item>
                                        </router-link>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!--  -->
                            <el-dropdown :style="{ marginLeft: '25px' }">
                                <Avatar :size="40" :userId="userId" :link="false" />
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <router-link :to="`/user/${userId}`">
                                            <el-dropdown-item>我的主页</el-dropdown-item>
                                        </router-link>
                                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>

                        </div>
                        <Avatar v-else @click="handleLoginAndRegister('login')"
                            :style="{ marginLeft: '10px', cursor: 'pointer' }" :link="false" :size="40" :userId="null">
                        </Avatar>

                    </div>
                </div>
            </header>
        </Transition>
        <main :style="{ paddingTop: headerHeightPlusSpace + 'px', minHeight: `calc(100vh - ${footerHeightPlusSpace}px)` }">
            <RouterView />
        </main>
        <footer :style="{ height: footerHeight + 'px' }">
            <div class="wrap" :style="{ maxWidth: mainWidth + 'px' }">
                <el-row>
                    <el-col :span="8">
                        <div class="logo">
                            <img src="../assets/imgs/cloud.png" alt="logo">
                            <span class="logo-title">浮云论坛</span>
                        </div>
                        <div class="intro">
                            欢迎您来此留下足迹
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <h3>友情连接</h3>
                        <a target="_blank" href="http://106.52.69.142:6002/index">浮云博客</a>
                    </el-col>
                    <el-col :span="8">
                        <h3>关于站长</h3>
                        <div>籍贯：茂名</div>
                        <div>邮箱：1147084140@qq.com</div>
                        <div>现住址：广州</div>
                    </el-col>
                </el-row>
            </div>
        </footer>
        <LoginAndRegister />
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useScrollHiddenHook } from '@/utils/hooks.js'
import LoginAndRegister from './components/LoginAndRegister.vue';
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import { useBoardInfoStore } from '@/stores/board.js'
import { storeToRefs } from 'pinia'
import { watch, ref, inject, getCurrentInstance } from 'vue'
import { logout } from '@/api/loginAndRegister.js'
import { Confirm } from '@/utils/Confirm.js'
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

const { userId, msgCount } = storeToRefs(userInfoStore)
const { headerHeight, mainWidth, headerHeightPlusSpace, footerHeight, footerHeightPlusSpace } = storeToRefs(pagePxStore)
const { boardList } = storeToRefs(boardInfo)

// 登录注册表单
const handleLoginAndRegister = (type) => {
    loginSettingStore.title = settings.loginFormTitle[type]
    loginSettingStore.show = true
}

// 发帖
const handlePublish = () => {
    router.push({ path: '/article' })
}

// 退出登录
const handleLogout = async () => {
    Confirm('确定退出吗?', '提示', async () => {
        const result = await logout()
        if (!result) {
            return
        }
        userInfoStore.$reset()
        if (route.meta.requireLogin) {
            // 当前所在的页面需要登录权限，回到首页
            router.push({ path: '/' })
        }
    })
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

                .logo {
                    font-size: 0px;

                    img {
                        width: 70px;
                    }
                }

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

    footer {
        background-color: #dfe4ea;
        padding: 10px 0;
        margin-top: 10px;
        font-size: 14px;

        .wrap {
            margin: 0 auto;
            color: $color-font;

            .logo {
                font-size: 0px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 10px;

                img {
                    width: 70px;
                }

                .logo-title {
                    margin-left: 10px;
                    font-size: 18px;
                }
            }

            h3 {
                margin-bottom: 6px;
                color: #000;
            }

            a {
                &:hover {
                    color: $color-blue;
                }
            }
        }
    }
}</style>