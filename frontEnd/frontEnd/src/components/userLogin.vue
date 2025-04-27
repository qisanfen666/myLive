<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import socket from '../utils/socket.ts'

const username = ref<string|null>('')
const password = ref<string|null>('')
const router = new useRouter()

const login = async ()=>{
    if(!username.value || !password.value){
        alert('请输入用户名和密码')
        return
    }
    
    try{
        const response = await axios.post('http://192.168.67.1:3000/api/login',{
            username: username.value,
            password: password.value,
        })
        if(response.data.token){
            localStorage.setItem('token',response.data.token) //将token存储到本地
            localStorage.setItem('username',username.value)

            socket.emit('userLogin',username.value)

            username.value = ''
            password.value = ''

            //跳转到直播页面
            router.push('/homePage')
            alert('登录成功')
        }
    }
    catch(err){
        console.error('登录请求失败:', err)
        alert(`登录失败:${err.response.data.message}`)
    }
}

const toRegister = ()=>{
    router.push('/register')
}

</script>

<template>
    <div class="login-page">
        <div class="login-container">
            <h1>登录</h1>
            <input type="text" v-model="username" placeholder="用户名" />
            <input type="password" v-model="password" placeholder="密码" />
            <button @click="login">登录</button>
        </div>
        <div class="toRegister">
            <h1>没有账号？</h1>
            <button @click="toRegister">去注册-></button>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 97vh;
    background-color: skyblue;
}

.login-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    width: 300px;
    height: 50vh;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.login-container h1 {
    margin-bottom: 20px;
    border:2px solid #71a8fa;
    border-radius: 10px;
    padding:10px;
    font-family:fantasy;
}

.login-container input {
    border-radius:10px;
    margin-bottom: 10px;
    padding: 10px;
    width: 200px;
    border:2px solid #71a8fa;
}

.login-container input:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border:2px solid #2871df;
}

.login-container button {
    border-radius:10px;
    padding: 10px;
    width: 200px;
    margin:auto;
    border:2px solid #71a8fa;
    background-color: #dee9f8;
}

.login-container button:hover {
    background-color: #4a8ef5;
}

.toRegister{
    display:flex;
    justify-content: center;
    align-items:center;
    color: #428bfa;
    text-decoration: none;
    cursor: pointer;
    margin-top: 10px;
    display: block;
    border:2px solid #edeff1;
    padding:10px;
}

.toRegister button {
    background-color: transparent;
    color: #458efc; 
    cursor: pointer;
    border:1px ridge #2078fc;
    border-radius:5px;
    width:100%;
}

</style>