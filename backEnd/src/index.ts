import Koa from 'koa'
import Router from 'koa-router'
import mongoose from 'mongoose'
import cors from 'koa-cors'
import bodyParser from 'koa-bodyparser'
import userRouter from './routes/index'
import { Server } from 'socket.io'
import http from 'http' 

const app = new Koa()
const router = new Router()

const port = 3000
const url = `http://localhost:${port}`

mongoose.connect('mongodb://localhost:27017/test').then(()=>{
    console.log('MongoDB connected')
}).catch((err)=>{
    console.error('MongoDB connection error:', err)
})

const server = http.createServer(app.callback())
const io = new Server(server)

io.on('connection',(socket)=>{
    console.log("a user connected",socket.id)

    //转发消息
    socket.on("signal",(data)=>{
        const {to,from,signal} = data
        io.to(to).emit("signal",{from,signal})
    })

    //加入房间
    socket.on("join-room",(roomId:string)=>{
        socket.join(roomId)
        console.log(`user ${socket.id} joined room ${roomId}`)
        io.to(roomId).emit("user-connected",socket.id)
    })

    //断开连接
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        io.emit("user-disconnected",socket.id)
    })
})

app.use(router.routes()).use(router.allowedMethods()).use(cors()).use(bodyParser())
app.use(userRouter.routes()).use(userRouter.allowedMethods())

app.listen(port,()=>{
    console.log(`Server is running at ${url}`)
})



