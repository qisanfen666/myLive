import { io } from "socket.io-client"

const socket = io('http://localhost:3000',{
    transports: ['websocket'],
})

socket.on('connect',()=>{
    console.log('socket连接成功')
})

export default socket