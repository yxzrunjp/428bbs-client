import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useLoginSettingStore } from '@/stores/loginSetting.js'
import settings from '@/utils/settings.js'
import Message from '@/utils/Message.js'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/layout/Index.vue'),
      children: [
        {
          path: '/',
          name: 'AllArticleList',
          meta: {
            requireLogin: false,
            title: '',
          },
          component: () => import('@/views/ArticleList/Index.vue')
        },
        {
          path: '/articleList/:pBoardId',
          name: 'FirstArticleList',
          meta: {
            requireLogin: false,
            title: '',
          },
          component: () => import('@/views/ArticleList/Index.vue')
        },
        {
          path: '/articleList/:pBoardId/:boardId',
          name: 'SecondArticleList',
          meta: {
            requireLogin: false,
            title: '',
          },
          component: () => import('@/views/ArticleList/Index.vue')
        },
        {
          path: '/articleDetail/:articleId',
          name: 'ArticleDetail',
          meta: {
            requireLogin: false,
            title: '文章详情',
          },
          component: () => import('@/views/ArticleDetail/Index.vue')
        },
        {
          path: '/user/:userId',
          name: 'User',
          meta: {
            requireLogin: false,
            title: '用户中心',
          },
          component: () => import('@/views/User/Index.vue')
        },
        {
          path: '/article',
          name: 'NewArticle',
          meta: {
            requireLogin: true,
            title: '发帖',
          },
          component: () => import('@/views/EditArticle/Index.vue')
        },
        {
          path: '/article/:articleId',
          name: 'EditArticle',
          meta: {
            requireLogin: true,
            title: '编辑帖子',
          },
          component: () => import('@/views/EditArticle/Index.vue')
        },
        {
          path: '/message/:code',
          name: 'Message',
          meta: {
            requireLogin: true,
            title: '消息中心',
          },
          component: () => import('@/views/Message/Index.vue')
        },
        {
          path: '/search',
          name: 'Search',
          meta: {
            requireLogin: false,
            title: '搜索',
          },
          component: () => import('@/views/Search/Index.vue')
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          meta: {
            requireLogin: false,
            title: '404',
          },
          component: () => import('@/views/NotFound/Index.vue')
        }
      ]
    },

  ]
})

router.beforeEach((to, from, next) => {
  const userInfoStore = useUserInfoStore()
  document.title = to.meta.title || '浮云论坛'
  if (to.meta.requireLogin && userInfoStore.userId) {
    // 前往的页面需要登录，且用户已登录
    next()
  } else if (to.meta.requireLogin && !userInfoStore.userId) {
    // 前往的页面需要登录，且用户未登录
    const loginSettingStore = useLoginSettingStore()
    // 重置用户信息
    userInfoStore.$reset()
    // 弹出登录框
    loginSettingStore.title = settings.loginFormTitle.login
    loginSettingStore.show = true
    Message.warning('请登录')
    next(from.fullPath)
  } else {
    next()
  }
})

export default router
