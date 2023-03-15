import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/layout/Index.vue'),
      children:[
        {
          path:'/',
          name:'AllArticleList',
          component:()=>import('@/views/ArticleList/Index.vue')
        },
        {
          path:'/articleList/:pBoardId',
          name:'FirstArticleList',
          component:()=>import('@/views/ArticleList/Index.vue')
        },
        {
          path:'/articleList/:pBoardId/:boardId',
          name:'SecondArticleList',
          component:()=>import('@/views/ArticleList/Index.vue')
        },
        {
          path:'/articleDetail/:articleId',
          name:'ArticleDetail',
          component:()=>import('@/views/ArticleDetail/Index.vue')
        },
        {
          path:'/user/:userId',
          name:'User',
          component:()=>import('@/views/User/Index.vue')
        },
        {
          path:'/article',
          name:'NewArticle',
          component:()=>import('@/views/EditArticle/Index.vue')
        },
        {
          path:'/article/:articleId',
          name:'EditArticle',
          component:()=>import('@/views/EditArticle/Index.vue')
        },
      ]
    }
  ]
})

export default router
