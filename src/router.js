import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '@/components/main-page/MainPageLayout.vue';

Vue.use(Router);
//
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: MainPage,
    },
    {
      path: '/day/:id',
      name: 'day',
      component: () => import('@/components/editing-page/EditingPageLayout.vue'),
    },
    {
      path: '*',
      component: MainPage,
    },
  ],
});
