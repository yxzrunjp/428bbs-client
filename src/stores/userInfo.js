import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/loginAndRegister.js'
// import Message from '@/utils/Message'
export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            nickName: '',
            province: '',
            userId: '',
            isAdmin: false,
        }
    },
    actions: {
        async getLoginUserInfo() {
            const result = await getUserInfo()
            if (!result) {
                return
            }
            this.$patch(result.data)
        }
    }
})