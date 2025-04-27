<script setup lang="ts">
import { io } from 'socket.io-client'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import socket from '../utils/socket.ts'

const router = useRoute()
const roomId = ref(router.params.roomId)
console.log(roomId.value)

const message = ref('')
const localVideo = ref<HTMLVideoElement|null>(null)   // 本地视频
const remoteVideo = ref<HTMLVideoElement|null>(null)    // 远程视频
const localStream = ref<MediaStream|null>(null)   // 本地媒体流
let peerConnection : RTCPeerConnection|null = null  //用来连接本地和远程的媒体流


//WebRTC配置,官方文档https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Using_webRTC
//ICE(interactive Connectivity Establishment)是WebRTC的核心协议,用于穿透NAT和防火墙
const config = {
    iceServers:[
        {
            urls:'stun:stun.l.google.com:19302' //谷歌的STUN服务器
        }
    ],
}

const getLocalStream = async ()=>{
    try{
        localStream.value = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true,
        })
        if(localStream.value && localVideo.value){
            localVideo.value.srcObject = localStream.value //将本地视频流绑定到video标签上
        }
    }
    catch(err){
        console.error('获取本地视频流失败:', err)
    }
}

const createOffer = async(userId:string)=>{
    try{
        //创建RTCPeerConnection对象
        peerConnection = new RTCPeerConnection(config)

        //将本地视频流添加到RTCPeerConnection对象中
        localStream.value?.getTracks().forEach((track)=>{
            peerConnection?.addTrack(track,localStream.value!)
        })

        //监听ICE候选者的生成事件
        peerConnection.onicecandidate = (event)=>{
            if(event.candidate){
                socket.emit('signal',{
                    to:userId,
                    signal:{
                        candidate:event.candidate,
                    }
                })
            }
        }

        //监听远程视频流的添加事件
        peerConnection.ontrack = (event)=>{
            if(remoteVideo.value){
                remoteVideo.value.srcObject = event.streams[0]
            }
        }

        //创建offer并设置本地描述
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)

        socket.emit('signal',{
            to:userId,
            from:localStream.value?.id,
            signal:{
                sdp:offer,
            }
        })
        console.log('创建Offer成功:',offer)
        console.log('设置本地描述成功:',localStream.value?.id)
        console.log('发送Offer成功:',userId)
    }
    catch(err){
        console.error('创建Offer失败:', err)
    }  
}

const initializeSocket = ()=>{

    socket.on('user-joined', (userId:string)=>{
        console.log('用户加入房间:', userId)
        createOffer(userId) //创建offer
    })

    socket.on('user-connected',async (userId:string)=>{
        console.log('用户连接:', userId)
        createOffer(userId) //创建offer
    })

    socket.on('signal', async (data:{from:string,to:string,signal:RTCSessionDescription})=>{
        const { from, to, signal } = data

        if(signal.sdp){
            //如果是SDP信令,则设置远程描述
            if(peerConnection){
                await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
                console.log('设置远程描述成功:', from)
            }
        }
        else if(signal.candidate){
            //如果是ICE候选者,则添加到RTCPeerConnection对象中
            if(peerConnection){
                await peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate))
                console.log('添加ICE候选者成功:', from)
            }
        }
        else{
            console.error('未知的信令类型:', signal)
        }
    })

    socket.on('user-disconnected', (userId:string)=>{
        console.log('用户断开连接:', userId)
        if(peerConnection){
            peerConnection.close()
            peerConnection = null
        }
    })
}

onMounted(()=>{
    getLocalStream() //获取本地视频流
    initializeSocket() //初始化socket连接
})

</script>

<template>
    <div class="video-page">
        <div class="video-page-left">
            <div class="video-container">
                <video ref="localVideo" autoplay muted></video>
            </div>       
            <div class="interaction-container">
                <span>111</span>
                <span>222</span>
                <span>333</span>
            </div>
        </div>
        <div class="video-page-right">
            <ul class="message-container">
                <li>uiui</li>
            </ul>
            <div class="input-container">
                <textarea type="text" v-model="message" placeholder="请输入消息" @keyup.enter="sendMessage"></textarea>
                <button @click="sendMessage">发送</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.video-page{
    display: flex;
    flex-direction:row;
}
.video-page-left{
    display: flex;
    flex-direction:column;
    flex-grow:3;
    justify-content:flex-start;
    align-items: center;
    height: 100vh;
    color: #fff;
}

.video-page-right{
    display: flex;
    flex-direction:column;
    flex-grow:1;
    justify-content:flex-start;
    align-items: flex-start;
    height: 100vh;
    color: #fff;
}


.video-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left:10px;
    border:1px solid #646363;
    width:90%;
    height:80vh;
    box-shadow: 0 0 10px rgba(44, 220, 233, 0.3);
}

video {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    margin: 0 0;
    object-fit:contain;
}

.interaction-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    border:1px solid #646363;
    width:90%;
    height:30vh;
    margin-left:10px;
    margin-top:10px;
    box-shadow: 0 0 10px rgba(21, 202, 226, 0.3);
}

.message-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width:80%;
    height:80vh;
    margin-right:10px;
    border:1px solid #646363;
    transform: translateY(-16px);
    box-shadow: 0 0 10px rgba(26, 192, 233, 0.2);
}

.input-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width:100%;
    height:20vh;
    margin-top:5px;
    margin-right:10px;
    border:0px solid #646363;
    transform:translateY(-16px);

}

textarea{
    width:92%;
    height:15vh;
    transform:translateY(-16px);
}

button{
    width:20%;
    height:5vh;
    transform:translateY(-16px);
    transform:translateX(215px);
    border:2px solid #646363;
    border-radius:5px;
}
@media (prefers-color-scheme: light) {  
    button{
        border:2px solid #646363;
    }
    button:hover{
        border:2px solid #646363;
    }
}
</style>