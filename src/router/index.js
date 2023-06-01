import { createRouter, createWebHistory } from 'vue-router';

import { Home } from '@/views';
import listsRoutes from './lists.routes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: Home },
        { ...listsRoutes},
        // catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/lists/laout' }
    ]
});

