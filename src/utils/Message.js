export default {
    success: (message, callback) => {
        ElMessage({
            type: 'success',
            duration: 2000,
            message,
            onClose: () => {
                if (callback) {
                    callback()
                }
            }
        })
    },
    error: (message, callback) => {
        ElMessage({
            type: 'error',
            duration: 2000,
            message,
            onClose: () => {
                if (callback) {
                    callback()
                }
            }
        })
    },
    warning: (message, callback) => {
        ElMessage({
            type: 'warning',
            duration: 2000,
            message,
            onClose: () => {
                if (callback) {
                    callback()
                }
            }
        })
    },
}
