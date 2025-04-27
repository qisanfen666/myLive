import Koa from 'koa'
import Router from 'koa-router'
import mongoose from 'mongoose'
import cors from 'koa-cors'
import bodyParser from 'koa-bodyparser'
import userRouter from './routes/index'
import { Server } from 'socket.io'
import http from 'http' 
import os from 'os'

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
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST'],
    }
})

app.use(router.routes()).use(router.allowedMethods()).use(cors()).use(bodyParser())
app.use(userRouter.routes()).use(userRouter.allowedMethods())

io.on('connection',(socket)=>{
    //console.log("a user connected",socket.id)
    const userMap:Record<string,string> = {}

    //转发消息
    socket.on("signal",(data)=>{
        const {to,from,signal} = data
        io.to(to).emit("signal",{from,signal})
    })

    //用户连接
    socket.on("userLogin",(username:string)=>{
        console.log(`user ${username} login`)
        userMap[socket.id] = username
    })

    //创建房间
    socket.on("create-room",(roomId:string)=>{
        const username = userMap[socket.id]
        socket.join(roomId)
        console.log(`user ${username} created room ${roomId}`)
        socket.emit("roomCreated",roomId)
    })

    //加入房间
    socket.on("join-room",(roomId:string)=>{
        const username = userMap[socket.id]
        socket.join(roomId)
        console.log(`user ${username} joined room ${roomId}`)
        io.to(roomId).emit("user-connected",socket.id)
    })

    //断开连接
    socket.on("disconnect",()=>{
        const username = userMap[socket.id]
        console.log("user disconnected",username)
        io.emit("user-disconnected",username)
    })
})


const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address; // 返回局域网 IP
            }
        }
    }
    return 'localhost'; // 如果无法获取局域网 IP，则返回 localhost
};

const localIP = getLocalIP();
console.log(`Server is running at http://${localIP}:${port}`);

server.listen(port,'0.0.0.0')



