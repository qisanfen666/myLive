<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref<string|null>('')
const email = ref<string|null>('')
const password = ref<string|null>('')
const _password = ref<string|null>('')

const router = useRouter()

const register = async()=>{
    console.log(username.value)
    console.log(email.value)
    console.log(password.value)
    if(!username.value|| !email.value || !password.value || !_password.value){
        alert('请输入完整信息')
        return
    }
    if(password.value !== _password.value){
        alert('两次密码不一致')
        return
    }
    try{
        const response = await axios.post('http://192.168.67.1:3000/api/register',{
            username:username.value,   
            password:password.value,
            email:email.value,
        })
        //如果response的status===201，则说明注册成功
        //如果response的status==401，则说明用户已存在
        if(response.status==201){
            alert('注册成功')
            username.value = ''
            password.value = ''
            _password.value = ''
            email.value = ''
            router.push('/')
        }
    }
    catch(err){
        console.error('注册请求失败:',err)
        alert(`注册失败:${err.response.data.message}`)
    }
}

</script> 

<template>
    <div class="login-page">
        <div class="login-container">
            <h1>注册</h1>
            <input type="text" v-model="username" placeholder="请输入用户名" /> 
            <input type="text" v-model="email" placeholder="请输入邮箱" />
            <input type="password" v-model="password" placeholder="请输入新密码" />
            <input type="password" v-model="_password" placeholder="请再次输入密码" />
            <button @click="register">注册</button>
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
    height: 70vh;
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

</style>