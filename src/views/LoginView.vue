<template>
    <div class="container-wrap">
        <div class="main-left">
            <img src="@/assets/img/login1.jpg">
        </div>
        <div class="main-right">
            <div class="container-login">
                <div class="title">Saber登陆页面</div>
                <div class="loginbar">
                    <el-menu :default-active="activeIndex" mode="horizontal" class="menu" text-color="black"
                        active-text-color="#409EFF" @select="changeBar">
                        <el-menu-item index='login'>密码登录</el-menu-item>
                        <el-menu-item index='VerifiCode'>验证码登录</el-menu-item>
                    </el-menu>
                    <router-view class="login-content"></router-view>
                    <el-button native-type="submit" type="primary" class="login-button" @click="handleLogin">登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {login} from '@/services/loginIn.js'
export default {
    data() {
        return {
            activeIndex: 'login'
        }
    },
    methods: {
        changeBar(index) {
            this.activeIndex = index;
            this.$router.replace({name:index});
        },
        async handleLogin(){
            try{
                await login(this.$store,this.$router,this.$message);
            }catch(err){
                console.log(err)
            }

            try{
                this.$axios.get('api/blade-system/menu/top-menu',{
                    withCredentials: true,
                    headers:{"Blade-Auth": `bearer ${this.$store.state.token}`}
                })
            }catch(err){
                console.log(err)
            }

            try{
                const currentURL=window.location.href;
                const domain = currentURL.split('/')[0] + '%2F%2F' + currentURL.split('/')[2];
                await this.$axios.get(`/api/blade-system/tenant/info?domain=${domain}`,{
                    withCredentials: true,
                    headers:{"Blade-Auth": `bearer ${this.$store.state.token}`}
                })
            }catch(err){
                console.log(err)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.container-wrap {
    display: flex;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: white;
}

.main-left {
    flex: 1;
    height: 100%;
    width: 100%;

    img {
        height: 100%;
        width: 100%;
    }
}

.main-right {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-x: hidden;
    white-space: nowrap;


    .container-login {
        width: 70%;
        margin-top: 25%;

        .title {
            font-size: 2rem;
            font-weight: bolder;
            margin-bottom: 3rem;
            padding-left: 1rem;
        }

        .loginbar {

            .menu {
                border-bottom: 0.1rem solid #e2e8f0;
                display: flex;

                el-menu-item {
                    flex-shrink: 0;
                }
            }

            .login-content {
                display: flex;
                flex-direction: column;
                padding: 1rem;
                gap: 1rem;
            }

            .login-button {
                width: 100%;
                margin-top: 2rem;
            }

        }
    }

}

@media screen and (max-width: 1050px) {
    .main-left {
        display: none;
    }

    .main-right {
        width: 100%;
    }
}
</style>