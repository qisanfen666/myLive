import { userCreate,userFind } from '../services/userService'
import { Context } from 'koa'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userRegister = async (ctx:Context)=>{
    const { username, password, email } = ctx.request.body as { username: string; password: string; email: string }
    try{
        if(!username || !password || !email){
            ctx.status = 400
            ctx.body = 'username, password and email are required'
            return false
        }
        const ret = await userFind(username)
        if(ret){
            ctx.status = 401
            ctx.body = {message:'用户名已存在'}
            return false
        }
        const user = await userCreate(username,password,email)
        ctx.status = 201
        ctx.body = {message:'注册成功'}
        console.log('user created:',user)
        return true
    }
    catch(err){
        ctx.status = 400
        ctx.body = err
        return false
    }
}

const userLogin = async (ctx:Context)=>{
    const { username, password } = ctx.request.body as { username:string, password:string }
    try{
        if(!username || !password){
            ctx.status = 400
            ctx.body = 'username and password are required'
            return false
        }
        const user = await userFind(username)
        if(!user){
            ctx.status = 404
            ctx.body = {message:'用户不存在'}
            return false
        }
        const isSame =await bcrypt.compare(password,user.password)
        if(!isSame){
            ctx.status = 401
            ctx.body = {message:'密码错误'}
            return false
        }

        const token = await jwt.sign({
            id:user._id,
            username:username,
            email:user.email
        },'secretKey@123',{ expiresIn: '1h' }) //token的有效期为1小时

        ctx.status = 200
        ctx.body = {message: 'login success',token}
        console.log('user logged in:',user.username)
        return true
    }
    catch(err){
        ctx.status = 400
        ctx.body = err
        return false
    }
}

const getUserInfo = async (ctx:Context)=>{
    const { username } = ctx.request.body as { username:string}
    try{
        if(!username){
            ctx.status = 400
            ctx.body = 'username is required'
            return false
        }
        const user = await userFind(username)
        if(!user){
            ctx.status = 404
            ctx.body = 'user not found'
            return false
        }
        ctx.status = 200
        ctx.body = user
        console.log('user info get:',user.username)
    }
    catch(err){
        ctx.status = 400
        ctx.body = err
        return false
    }
}


export{
    userRegister,
    userLogin,
    getUserInfo,
}
