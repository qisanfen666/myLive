import jwt from 'jsonwebtoken'
import { Context,Next } from 'koa'

const authMiddleware = async (ctx:Context,next:Next)=>{
    try{
        const token = ctx.request.headers['authorization']?.split(' ')[1]
        if(!token){
            ctx.status = 401
            ctx.body = 'No token provided'
            return false
        }
        const decoded = jwt.verify(token,"secretKey@123")
        ctx.state.user = decoded
        await next()
    }
    catch(err){
        ctx.status = 401
        ctx.body = 'Invalid token'
        return false
    }
}

export default authMiddleware