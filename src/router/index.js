import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import("../components/login/Login.vue")
const Home = () => import("../components/home/Home.vue")
const Welcome = () => import("../components/welcome/Welcome.vue")
const Users = () => import("../components/users/Users.vue")
const Roles = () => import("../components/roles/Roles.vue")
const Rights = () => import("../components/rights/Rights.vue")
const Reports = () => import("../components/reports/Reports.vue")
const Params = () => import("../components/params/Params.vue")
const Orders = () => import("../components/orders/Orders.vue")
const Goods = () => import("../components/goods/Goods.vue")
const Categories = () => import("../components/categories/Categories.vue")

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
        component:Home,
        redirect:'/welcome',
        children:[
            {
              path:'/welcome',
              component:Welcome
            },
            {
              path:'/users',
              component:Users,
            },
            {
              path:'/roles',
              component:Roles,
            },
            {
              path:'/rights',
              component:Rights,
            },
            {
              path:'/reports',
              component:Reports,
            },
            {
              path:'/params',
              component:Params,
            },
            {
              path:'/orders',
              component:Orders,
            },
            {
              path:'/goods',
              component:Goods,
            },
            {
              path:'/categories',
              component:Categories,
            },

        ]
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