import { createRouter, createWebHashHistory } from 'vue-router'

import { routes as PageRoutes } from '@/views/routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...PageRoutes,
    // 捕获 404 Not found 路由
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/',
    },
  ],
})

export default router
