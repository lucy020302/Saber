import CryptoJS from 'crypto-js';
import axios from 'axios'


export async function login(store,router,message) {
    sessionStorage.setItem('isNavigatingByClick', 'true');
    const encryptedPassword = CryptoJS.MD5(store.state.password).toString();
    const queryString = new URLSearchParams({
        tenantId: '000000',
        username: store.state.user,
        password: encryptedPassword,
        grant_type: 'captcha',
        scope: 'all',
        type: 'account'
    }).toString();

    const url = `/api/blade-auth/oauth/token?${queryString}`;

    try {
        const res = await axios.post(url, {}, {
            headers: {
                'Captcha-Code': store.state.code,
                'Captcha-Key': store.state.captchaKey,
                'Authorization': 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'//基本认证 解码后这个字符串的格式通常为 username:password
            }
        })
        if (res.data.error_code == '400') {
            store.dispatch('fetchCaptcha');
            message.error('用户名或密码错误')
            throw new Error('用户名或密码错误')
        } else {
            sessionStorage.setItem('token', res.data.access_token)
            store.commit('setToken', sessionStorage.getItem('token'));
            router.replace({ name: 'homeIndex' });
        }}
        catch(err ) {
            if (err.response&&err.response.data.code == '400') {
                store.dispatch('fetchCaptcha');
                message.error('验证码错误');
                throw new Error('验证码错误');
            } else {
                throw err;
            }
        }
}