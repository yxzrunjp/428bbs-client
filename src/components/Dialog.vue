<template>
    <el-dialog :model-value="show" :title="title" @close="close" :before-close="handleBeforeClose"
        :close-on-click-modal="false" :show-close="showClose" :draggable="true" class="custom-dialog" :width="width"
        :top="top">
        <div class="dialog-body">
            <slot></slot>
        </div>
        <template v-if="buttons.length" #footer>
            <el-button v-for="btn, idx in buttons" :key="idx" :style="btn.style" :type="btn.type" @click="btn.click">{{ btn.text
            }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '标题',
    },
    showClose: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: '40%'
    },
    top: {
        type: String,
        default: '50px'
    },
    buttons: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const handleBeforeClose = (done) => {
    done()
}
const emit = defineEmits(['close'])
const close = () => {
    emit('close')
}
</script>

<style lang="scss">
.custom-dialog {
    .el-dialog__body {
        border-top: 1px solid #ddd;
        .dialog-body {
            max-height: calc(100vh - 300px);
            overflow: auto;
        }
    }

    .el-dialog__footer {
        padding-top: 0;
        text-align: center;
    }

}
</style>