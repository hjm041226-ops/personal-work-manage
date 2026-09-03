// ============================================================
// 路由表
//   /login                登录（独立整屏）
//   /                     AppShell 后台框架（重定向 /works）
//     /works              作品管理
//     /works/upload       上传新作品
//     /works/:id/edit     编辑作品
//     /profile            个人资料编辑
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'

const AppShell = () => import('@/common/components/AppShell/index.vue')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: AppShell,
    redirect: '/works',
    children: [
      {
        path: 'works',
        name: 'works',
        component: () => import('@/pages/works-manage/index.vue'),
        meta: { title: '作品管理' },
      },
      {
        path: 'works/upload',
        name: 'work-upload',
        component: () => import('@/pages/work-upload/index.vue'),
        meta: { title: '上传新作品' },
      },
      {
        path: 'works/:id/edit',
        name: 'work-edit',
        component: () => import('@/pages/work-edit/index.vue'),
        props: true,
        meta: { title: '编辑作品' },
      },
      {
        path: 'profile',
        name: 'profile-edit',
        component: () => import('@/pages/profile-edit/index.vue'),
        meta: { title: '个人资料编辑' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/works' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  const title = to.meta?.title
  document.title = title ? `${title} · ATELIER CMS` : 'ATELIER CMS · 个人作品后台管理系统'
})

export default router
