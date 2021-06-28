import Vue from "vue";
import Router from 'vue-router';
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(Router);

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },

];
const router = new Router({
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tokenStr = sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();

})
export default router;
