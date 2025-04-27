import Router from 'koa-router'
import { userRegister, userLogin, getUserInfo } from '../controllers/userController'
import verifyToken from '../utils/verifyToken'

const router = new Router()

router.prefix('/api')

router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/userinfo',getUserInfo)
router.post('/verifyToken',verifyToken)

export default router