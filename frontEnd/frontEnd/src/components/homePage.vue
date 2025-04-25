<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const roomId = ref<string|null>('')

const startLive = ()=>{
    const userRoomId = 'room1'
    router.push(`/liveStream/${userRoomId}`)
}

const joinLive = ()=>{
    if(!roomId.value.trim()){
        alert('请输入房间号')
        return
    }
    router.push(`/liveStream/${roomId.value}`)
}

const editProfile = ()=>{
    router.push('/profile')
}

</script>

<template>
    <div class="home-page">
        <h1>欢迎来到直播平台</h1>
        <div class="actions">
            <button @click="startLive">开直播</button>
            <div class="join-room">
                <input v-model="roomId" placeholder="请输入直播间 ID" />
                <button @click="joinLive">进入直播间</button>
            </div>
            <button @click="editProfile">修改个人信息</button>
        </div>
    </div>
</template>

<style scoped>
.home-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f4;
}

.actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    border: 2px solid #646363;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ffffff;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #e0e0e0;
}

input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
}
</style>