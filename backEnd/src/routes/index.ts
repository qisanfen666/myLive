import Router from 'koa-router'
import { userRegister, userLogin, getUserInfo } from '../controllers/userController'

const router = new Router()

router.prefix('/api')

router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/userinfo',getUserInfo)

export default router