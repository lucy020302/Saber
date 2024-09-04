<template>
    <div>
        <el-input type="tel" prefix-icon="el-icon-mobile-phone" v-model="mobile" placeholder="请输入手机号" required
            clearable></el-input>
        <el-input type="text" prefix-icon="el-icon-key" v-model="mobileCode" placeholder="请输入验证码" required clearable>
            <el-button @click="sendCode" :disabled="isSending || countdown > 0" :loading="isSending" slot="suffix">
                {{ isSending ? '发送中...' : countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
            </el-button>
        </el-input>

    </div>
</template>

<script>
export default {
    name:"VerifiCode",
    data() {
        return {
            mobile: '',
            mobileCode: '',
            isSending: false,
            countdown: 0
        }
    },
    methods: {
        sendCode() {

            //发送有效期内
            if (this.isSending || this.countdown > 0) {
                return
            }

            const startCountDown = () => {
                this.countdown = 60;
                const time = setInterval(() => {
                    this.countdown--;
                    if (this.countdown <= 0) {
                        clearInterval(time);
                    }
                }, 1000);
            }
            this.isSending = true;
            setTimeout(() => {
                this.isSending = false;
                startCountDown();
            }, 200);
        }
    }
}
</script>
