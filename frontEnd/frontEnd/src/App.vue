<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' 
import socket from './utils/socket.ts'

const router = useRouter()

onMounted(async()=>{
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  if(token&&username){
    try{
      const response = await axios.post('http://192.168.67.1:3000/api/verifyToken',{token})
      if(response.data.valid){
        socket.emit('userLogin',username)

        router.push('/homePage')
      }
      else{
        localStorage.removeItem('token')
        localStorage.removeItem('username')
      }
    }
    catch(err){
      console.error('登录请求失败:', err)
      alert(`登录失败:${err.response.data.message}`)
    }
  }
})

</script>

<template>
  <router-view/>
</template>

<style scoped>

</style>
