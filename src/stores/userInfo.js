import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/loginAndRegister.js'
import { getMessageCount,getSysSetting } from '@/api/user.js'
// import Message from '@/utils/Message'
export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            nickName: '',
            userId: '',
            msgCount: {
                total: 0,
                sys: 0,
                reply: 0,
                likePost: 0,
                likeComment: 0,
                downloadAttachment: 0,
            },
            sysInfo:{
                commentOpen:false,
            }
        }
    },
    actions: {
        async getLoginUserInfo() {
            const result = await getUserInfo()
            if (!result) {
                return
            }
            this.userId = result.data?.userId||''
            this.nickName = result.data?.nickName||''
            
            this.getSysInfo()
            if (this.userId) {
                this.getMsgInfo()
            }
        },
        async getMsgInfo() {
            const result = await getMessageCount()
            if (!result) {
                return
            }
            this.msgCount = result.data
        },
        async getSysInfo(){
            const result = await getSysSetting()
            if(!result){
                return
            }
            this.sysInfo = result.data
        },
        setMsgCount(type){
            this.msgCount.total = this.msgCount.total - this.msgCount[type]
            this.msgCount[type] = 0
        }
    },
})