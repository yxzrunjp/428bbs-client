import { defineStore } from 'pinia'

export const usePagePxStore = defineStore('pagePx', {
    state: () => {
        return {
            mainWidth: 1300,
            headerHeight: 60,
        }
    },
    getters: {
        // header高度加10px间距
        headerHeightPlusSpace: (state) => {
            return state.headerHeight + 10
        },
    }
})