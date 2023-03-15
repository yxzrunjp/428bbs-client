import { defineStore } from 'pinia'

export const useLoginSettingStore = defineStore('loginSetting', {
    state: () => {
        return {
            show: false,
            title: '',
            showClose: true,
        }
    }
})