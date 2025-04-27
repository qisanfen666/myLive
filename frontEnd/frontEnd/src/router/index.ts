import { createRouter,createWebHistory } from 'vue-router'
import userLogin from '../components/userLogin.vue'
import userliveStream from '../components/liveStream.vue'
import homePage from '../components/homePage.vue'
import userRegister from '../components/userRegister.vue'

const routes = [
    {path:'/',name:'login',component:userLogin},
    {path:'/register',name:'register',component:userRegister},
    {path:'/liveStream/:roomId',name:'liveStream',component:userliveStream},
    {path:'/homePage',name:'homePage',component:homePage},
]

// 创建路由实例
const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to,from,next)=>{
    const token = localStorage.getItem('token')
    console.log(from.path)
    if(to.path !== '/' && to.path !== '/register' && !token){
        alert('请先登录')
        next('/')
    }
    else{
        next()
    }
})

export default router