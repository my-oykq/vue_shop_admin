# my-project

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## 路由导航守卫控制页面访问权限
1.如果用户没有登录，但是直接通过URL访问特定界面，需要重新导航到登录页面
beforeEach((to,from,next) =>{
    //to:将要访问的页面路径
    //from:代表从哪个路径跳转的
    //next:代表一个放行的函数
})
2.如果用户访问的是登录页，直接放行
如果访问的不是登录页，就要判断从seesionStorage是否存了用户的token，有token就调用token，放行。
没有token就证明你没有登录，强制让用户跳转到登录页面

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

## 退出功能实现原理
1.基于token的方式实现退出比较简单，只需要销毁本地的token即可。后续的请求将不会携带token，必须重新登录生成一个新的token之后才可以访问页面
 //   清楚sessionStorage中token
    window.sessionStorage.clear()
//   跳转到登录页面
    this.$router.push('/login')