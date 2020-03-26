import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import("../components/login/Login.vue")
const Home = () => import("../components/home/Home.vue")

Vue.use(VueRouter)

const routes = [
    {
       path:'/',
       redirect: '/login' 
    },
    {
       path:'/login',
       component: Login
    },
    {
        path:'/home',
        component:Home
    }

]

const router = new VueRouter({
    routes

})

// 路由导航守卫

router.beforeEach((to, from, next) => {
    // 1.如果用户访问的路径和当前访问的路径一样的话放行
    if(to.path === '/login') return next()
    // 2.如果用户没有登录就像去对应的页面的话，先判断这个用用户有没有token
    // 2-1先从window的sessionStorage获取token
    const tokenStr = window.sessionStorage.getItem('token')
    // 如果用户没有token的话强制让用户跳转到登录界面
    if(!tokenStr) return next('/login')

    //有token放行
        next()
})
export default router