<template>
    <div class="inputDeep">
        <el-input type="text" prefix-icon="el-icon-user" v-model="user" placeholder="请输入账号" required
            clearable></el-input>
        <el-input type="password" prefix-icon="el-icon-lock" v-model='password' placeholder="请输入密码" required clearable
            show-password></el-input>
        <el-input type="text" prefix-icon="el-icon-key" v-model="code" placeholder="请输入验证码" required clearable @keydown.enter.native="handleLogin">
        </el-input>
        
        <img :src="captchaImg" alt="验证码" @click="fetchCaptcha" style="height: 3rem ;width: 10rem;">
    </div>
</template>

<script>
import {login} from '@/services/loginIn.js'
export default {
    name:'login',
    data() {
        return {
            user: '',
            password: '',
            code: '',
        }
    },
    computed: {
        captchaImg() {
            return this.$store.state.captchaImg;
        }
    },
    watch: {
        user(newVal) {
            this.$store.commit('setUser', newVal);
        },
        password(newVal) {
            this.$store.commit('setPassword', newVal)
        },
        code(newVal) {
            this.$store.commit('setCode', newVal)
        }
    },
    created(){
        this.$store.dispatch('fetchCaptcha');
    },
    methods: {
        fetchCaptcha() {
            this.$store.dispatch('fetchCaptcha')
        },
        async handleLogin(){
            try{
                await login(this.$store,this.$router,this.$message);
            }catch(err){
                console.log(err)
            }
        }
    }
}
</script>
