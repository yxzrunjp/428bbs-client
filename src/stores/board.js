import { defineStore } from 'pinia'
import { loadBoard } from '@/api/loginAndRegister.js'
export const useBoardInfoStore = defineStore('boardInfo', {
    state: () => {
        return {
            boardList: [],
        }
    },
    actions: {
        async getBoardList() {
            const result = await loadBoard()
            if (!result) {
                return
            }
            Object.assign(this.boardList, result.data)
        }
    },
    getters: {
        getChildBoardById: (state) => {
            return (id) => {
                return state.boardList.find((board) => `${board.boardId}` === id)?.children || []
            }
        },
    },
})