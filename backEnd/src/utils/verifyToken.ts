import jwt from 'jsonwebtoken'
import { Context } from 'koa'

const verifyToken = async (ctx:Context)=>{
    const { token } = ctx.request.body as { token:string }
    try{
        const decoded = jwt.verify(token,"secretKey@123")
        ctx.status = 200
        ctx.body = {valid:true,decoded}
    }
    catch{
        ctx.status = 401
        ctx.body = {valid:false}
    }
}

export default verifyToken